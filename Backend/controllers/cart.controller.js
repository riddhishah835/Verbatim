import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/Product.model.js";

const productFields = "name price image stock category";

const getProductId = (req, res) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ success: false, message: "Invalid product id" });
        return null;
    }
    return productId;
};

const getPopulatedCart = async (customer) => {
    await customer.populate({ path: "cart.product", select: productFields });
    return customer.cart
        .filter((item) => item.product)
        .map((item) => ({ product: item.product, quantity: item.quantity }));
};

export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customerfound._id);
        if (!customer) {
            return res.status(401).json({ success: false, message: "Customer not found" });
        }

        const cart = await getPopulatedCart(customer);
        return res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("Failed to get cart:", error);
        return res.status(500).json({ success: false, message: "Unable to load cart" });
    }
};

export const addToCart = async (req, res) => {
    const productId = getProductId(req, res);
    if (!productId) return;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = req.customerfound;
        const cartItem = customer.cart.find((item) => item.product.equals(productId));
        const newQuantity = cartItem ? cartItem.quantity + 1 : 1;
        if (product.stock === undefined || product.stock === null || newQuantity > product.stock) {
            return res.status(400).json({ success: false, message: "Requested quantity exceeds available stock" });
        }

        if (cartItem) {
            cartItem.quantity = newQuantity;
        } else {
            customer.cart.push({ product: product._id, quantity: 1 });
        }
        await customer.save();

        const cart = await getPopulatedCart(customer);
        return res.status(200).json({ success: true, message: "Cart updated", cart });
    } catch (error) {
        console.error("Failed to add product to cart:", error);
        return res.status(500).json({ success: false, message: "Unable to add product to cart" });
    }
};

export const updateCartQuantity = async (req, res) => {
    const productId = getProductId(req, res);
    if (!productId) return;

    const { quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, message: "Quantity must be a number of at least 1" });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        if (product.stock === undefined || product.stock === null || quantity > product.stock) {
            return res.status(400).json({ success: false, message: "Requested quantity exceeds available stock" });
        }

        const customer = req.customerfound;
        const cartItem = customer.cart.find((item) => item.product.equals(productId));
        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Product is not in cart" });
        }

        cartItem.quantity = quantity;
        await customer.save();

        const cart = await getPopulatedCart(customer);
        return res.status(200).json({ success: true, message: "Cart updated", cart });
    } catch (error) {
        console.error("Failed to update cart quantity:", error);
        return res.status(500).json({ success: false, message: "Unable to update cart" });
    }
};

export const removeFromCart = async (req, res) => {
    const productId = getProductId(req, res);
    if (!productId) return;

    try {
        const customer = req.customerfound;
        const cartIndex = customer.cart.findIndex((item) => item.product.equals(productId));
        if (cartIndex === -1) {
            return res.status(404).json({ success: false, message: "Product is not in cart" });
        }

        customer.cart.splice(cartIndex, 1);
        await customer.save();

        const cart = await getPopulatedCart(customer);
        return res.status(200).json({ success: true, message: "Product removed from cart", cart });
    } catch (error) {
        console.error("Failed to remove product from cart:", error);
        return res.status(500).json({ success: false, message: "Unable to remove product from cart" });
    }
};