import express from "express";
import isauth from "../middlewares/auth.middleware.js";
import {
    createPaymentOrder,
    getOrder,
    getOrders,
    verifyPayment
} from "../controllers/order.controller.js";

const orderRoutes = express.Router();

orderRoutes.use(isauth);
orderRoutes.post("/create-payment-order", createPaymentOrder);
orderRoutes.post("/verify-payment", verifyPayment);
orderRoutes.get("/", getOrders);
orderRoutes.get("/:id", getOrder);

export default orderRoutes;
