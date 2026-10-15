import crypto from "node:crypto";
import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import Product from "../models/Product.model.js";
import getRazorpay from "../config/razorpay.js";

const getShippingAddress = (address) => {
    if (!address || typeof address !== "object" || Array.isArray(address)) {
        return null;
    }

    const fields = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
    const cleanAddress = {};

    for (const field of fields) {
        if (typeof address[field] !== "string" || !address[field].trim()) {
            return null;
        }
        cleanAddress[field] = address[field].trim();
    }

    if (!/^[6-9]\d{9}$/.test(cleanAddress.phone)) {
        return null;
    }
    if (!/^\d{6}$/.test(cleanAddress.pincode)) {
        return null;
    }

    return cleanAddress;
};

export const createPaymentOrder = async (req, res) => {
    const shippingAddress = getShippingAddress(req.body?.shippingAddress);
    if (!shippingAddress) {
        return res.status(400).json({
            success: false,
            message: "Enter a valid shipping address, 10-digit phone number and 6-digit pincode"
        });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(503).json({
            success: false,
            message: "Razorpay test keys are not configured on the server"
        });
    }

    try {
        const customer = await Customer.findById(req.customerfound._id);
        if (!customer) {
            return res.status(401).json({ success: false, message: "Customer not found" });
        }
        if (!customer.cart.length) {
            return res.status(400).json({ success: false, message: "Your cart is empty" });
        }

        const items = [];
        let totalAmount = 0;

        for (const cartItem of customer.cart) {
            if (!mongoose.Types.ObjectId.isValid(cartItem.product)) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart is no longer available"
                });
            }

            const product = await Product.findById(cartItem.product);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart is no longer available"
                });
            }
            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}.`
                });
            }

            items.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            });
            totalAmount += product.price * cartItem.quantity;
        }

        totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
        if (totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Your order total must be greater than zero"
            });
        }
        const order = await Order.create({
            user: customer._id,
            items,
            shippingAddress,
            totalAmount
        });

        try {
            const razorpayOrder = await getRazorpay().orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: order._id.toString()
            });

            order.razorpayOrderId = razorpayOrder.id;
            await order.save();

            return res.status(201).json({
                success: true,
                verbatimOrderId: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID,
                totalAmount: order.totalAmount,
                items: order.items
            });
        } catch (error) {
            console.error("Unable to create Razorpay order:", error);
            try {
                await order.deleteOne();
            } catch (cleanupError) {
                console.error("Unable to remove incomplete order:", cleanupError);
            }
            return res.status(502).json({
                success: false,
                message: "Unable to start payment. Please try again."
            });
        }
    } catch (error) {
        console.error("Unable to create checkout order:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create your order"
        });
    }
};

export const verifyPayment = async (req, res) => {
    const {
        verbatimOrderId,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature
    } = req.body || {};

    if (
        !mongoose.Types.ObjectId.isValid(verbatimOrderId) ||
        typeof razorpayOrderId !== "string" ||
        typeof razorpayPaymentId !== "string" ||
        typeof razorpaySignature !== "string"
    ) {
        return res.status(400).json({ success: false, message: "Invalid payment details" });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(503).json({
            success: false,
            message: "Razorpay test keys are not configured on the server"
        });
    }

    try {
        const order = await Order.findOne({
            _id: verbatimOrderId,
            user: req.customerfound._id
        });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if (!order.razorpayOrderId || order.razorpayOrderId !== razorpayOrderId) {
            return res.status(400).json({ success: false, message: "Payment order does not match" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${order.razorpayOrderId}|${razorpayPaymentId}`)
            .digest("hex");
        const expectedBuffer = Buffer.from(expectedSignature);
        const receivedBuffer = Buffer.from(razorpaySignature);

        if (
            expectedBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        if (order.paymentStatus === "PAID") {
            return res.status(200).json({ success: true, order });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpayPaymentId;
        await order.save();

        const customer = await Customer.findById(req.customerfound._id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        customer.cart = [];
        await customer.save();

        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Unable to verify payment:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to verify payment"
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.customerfound._id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Unable to load orders:", error);
        return res.status(500).json({ success: false, message: "Unable to load your orders" });
    }
};

export const getOrder = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.customerfound._id
        });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Unable to load order:", error);
        return res.status(500).json({ success: false, message: "Unable to load this order" });
    }
};
