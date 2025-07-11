import express from "express";
import { getProducts, registerProduct, UpdateProduct } from "../controllers/productController.js";

const router = express.Router();
router.get("/getproduct", getProducts);
router.post("/registerproduct", registerProduct);
router.post("/updateproduct", UpdateProduct);

export default router;