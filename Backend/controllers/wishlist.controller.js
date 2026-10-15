import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/Product.model.js";

const getProductId = (req, res) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ success: false, message: "Invalid product id" });
        return null;
    }
    return productId;
};

export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customerfound._id)
            .populate({ path: "wishlist", select: "name price category image stock" });
        if (!customer) {
            return res.status(401).json({ success: false, message: "Customer not found" });
        }
        const wishlist = customer.wishlist.filter(Boolean);

        return res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist
        });
    } catch (error) {
        console.error("Failed to get wishlist:", error);
        return res.status(500).json({ success: false, message: "Unable to load wishlist" });
    }
};

export const addToWishlist = async (req, res) => {
    const productId = getProductId(req, res);
    if (!productId) return;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(req.customerfound._id);
        if (!customer) {
            return res.status(401).json({ success: false, message: "Customer not found" });
        }
        if (customer.wishlist.some((id) => id.equals(productId))) {
            return res.status(409).json({ success: false, message: "Product is already in wishlist" });
        }

        customer.wishlist.push(product._id);
        await customer.save();

        return res.status(201).json({
            success: true,
            count: customer.wishlist.length,
            message: "Product added to wishlist"
        });
    } catch (error) {
        console.error("Failed to add product to wishlist:", error);
        return res.status(500).json({ success: false, message: "Unable to add product to wishlist" });
    }
};

export const removeFromWishlist = async (req, res) => {
    const productId = getProductId(req, res);
    if (!productId) return;

    try {
        const customer = await Customer.findById(req.customerfound._id);
        if (!customer) {
            return res.status(401).json({ success: false, message: "Customer not found" });
        }
        const wishlistIndex = customer.wishlist.findIndex((id) => id.equals(productId));
        if (wishlistIndex === -1) {
            return res.status(404).json({ success: false, message: "Product is not in wishlist" });
        }

        customer.wishlist.splice(wishlistIndex, 1);
        await customer.save();

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            message: "Product removed from wishlist"
        });
    } catch (error) {
        console.error("Failed to remove product from wishlist:", error);
        return res.status(500).json({ success: false, message: "Unable to remove product from wishlist" });
    }
};

export const toggleWishlist = async (req, res) => {
    const productId = getProductId(req, res);
    if (!productId) return;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(req.customerfound._id);
        if (!customer) {
            return res.status(401).json({ success: false, message: "Customer not found" });
        }
        const wishlistIndex = customer.wishlist.findIndex((id) => id.equals(productId));
        const saved = wishlistIndex === -1;

        if (saved) {
            customer.wishlist.push(product._id);
        } else {
            customer.wishlist.splice(wishlistIndex, 1);
        }
        await customer.save();

        return res.status(200).json({
            success: true,
            saved,
            count: customer.wishlist.length,
            message: saved ? "Product added to wishlist" : "Product removed from wishlist"
        });
    } catch (error) {
        console.error("Failed to toggle wishlist product:", error);
        return res.status(500).json({ success: false, message: "Unable to update wishlist" });
    }
};
