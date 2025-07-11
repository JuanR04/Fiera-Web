import express from "express";
<<<<<<< HEAD
import { getProducts, registerProduct, UpdateProduct } from "../controllers/productController.js";
=======
import { deleteProductById, getProductById, getProducts, registerProduct } from "../controllers/productController.js";
>>>>>>> 21b5bf3d30b5d8bf2fa13b947bdca7feb6eabd28

const router = express.Router(); 
router.get("/getproduct", getProducts);
router.get("/product/:id",getProductById);
router.post("/registerproduct", registerProduct);
<<<<<<< HEAD
router.post("/updateproduct", UpdateProduct);
=======
router.delete("/product/:id", deleteProductById);
>>>>>>> 21b5bf3d30b5d8bf2fa13b947bdca7feb6eabd28

export default router;