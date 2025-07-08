import express from "express";
import { getProducts, registerProduct } from "../controllers/productController.js";

const router = express.Router();
router.get("/getproduct", getProducts);
router.post("/registerproduct", registerProduct);

export default router;