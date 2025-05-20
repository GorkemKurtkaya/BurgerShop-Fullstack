import express from "express";
import { createProduct, fetchProducts, fetchProductById, editProduct, removeProduct, fetchPopularProducts } from "../controllers/productController.js";
import { adminGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin rotaları
router.post("/", adminGuard, createProduct);
router.put("/:id", adminGuard, editProduct);
router.delete("/:id", adminGuard, removeProduct);

// Normal kullanıcı rotaları
router.get("/", fetchProducts);
router.get("/popular", fetchPopularProducts);
router.get("/:id", fetchProductById);

export default router;
