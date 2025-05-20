import express from "express";
import { getUsers,getUser,updateUser,deleteUser } from "../controllers/userController.js";
import { adminGuard } from "../middleware/authMiddleware.js";


const router = express.Router();


// Admin korumalı rotalar
router.put("/:id", adminGuard, updateUser);
router.delete("/:id", adminGuard, deleteUser);

// Normal kullanıcı rotaları
router.get("/", getUsers);
router.get("/:id", getUser);




export default router;