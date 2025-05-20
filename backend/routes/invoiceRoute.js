import express from "express";
import {getInvoices, getInvoice, getUserInvoice,getOrderInvoice } from "../controllers/invoiceController.js";



const router = express.Router();

router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.get("/user/:user_id", getUserInvoice);
router.get("/order/:order_id", getOrderInvoice);


export default router;