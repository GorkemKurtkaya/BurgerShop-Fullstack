import express from "express";
import { register, login, logout, checkUser, checkAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", checkUser);
router.get("/check-admin", checkAdmin);

export default router;
