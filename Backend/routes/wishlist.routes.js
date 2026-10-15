import express from "express";
import isauth from "../middlewares/auth.middleware.js";
import { addToWishlist, getWishlist, removeFromWishlist, toggleWishlist } from "../controllers/wishlist.controller.js";

const wishlistRoutes = express.Router();

wishlistRoutes.use(isauth);
wishlistRoutes.get("/", getWishlist);
wishlistRoutes.post("/:productId", addToWishlist);
wishlistRoutes.delete("/:productId", removeFromWishlist);
wishlistRoutes.patch("/:productId/toggle", toggleWishlist);

export default wishlistRoutes;
