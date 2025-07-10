import express from "express";
import { deleteProductById, getProductById, getProducts, registerProduct } from "../controllers/productController.js";

const router = express.Router(); 
router.get("/getproduct", getProducts);
router.get("/product/:id",getProductById);
router.post("/registerproduct", registerProduct);
router.delete("/product/:id", deleteProductById);

export default router;