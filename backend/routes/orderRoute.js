import express from "express";
import { createOrder, fetchUserOrders, fetchOrderById, changeOrderStatus, removeOrder, fetchAllOrders, checkAndUpdateOrderStatus } from "../controllers/orderController.js";
import { authMiddleware, adminGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tüm route'lar için önce auth kontrolü
router.use(authMiddleware);

// Admin korumalı rotalar
router.get("/", adminGuard, fetchAllOrders);
router.delete("/:id", adminGuard, removeOrder);
router.put("/:id", changeOrderStatus);
router.post("/check-orders", adminGuard, checkAndUpdateOrderStatus);

// Normal kullanıcı rotaları
router.post("/", createOrder);
router.get("/user/:user_id", fetchUserOrders);
router.get("/:id", fetchOrderById);

export default router; 