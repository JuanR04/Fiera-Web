import express from "express";
import { getProducts, registerProduct, UpdateProduct,deleteProductById, getProductById} from "../controllers/productController.js";


const router = express.Router(); 
router.get("/getproduct", getProducts);
router.get("/product/:id",getProductById);
router.post("/registerproduct", registerProduct);
router.post("/updateproduct", UpdateProduct);
router.delete("/product/:id", deleteProductById);

export default router;