import {findProducts, CreateProducts} from "../models/productModel.js";
import { createDetailsProduct } from "../models/productDetailModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import multer from 'multer'; 


const upload = multer({ dest: 'uploads/' });

export const getProducts = async(req,res) =>{
    try{
        const products = await findProducts();
        res.status(200).json(products);
    }catch(error){
        res.status(500).json({message:"Error en el sevidor", error:error.message})
    }
}

export const registerProduct =[
    upload.single('image'), 
    async(req, res) =>{
        console.log(req.body);
        const {num_referencia,category,description,name,subcategory,type,size_min,size_max,material,colors} = req.body;

        if (
            !num_referencia ||
            !category ||
            !name ||
            !subcategory ||
            !type ||
            !size_min ||
            !size_max ||
            !material||
            !colors
        ) {
            return res.status(400).json({ message: "Todos los campos son obligatorios excepto la descripción." });
        }

        try{
            const result = await cloudinary.uploader.upload(req.file.path);
            const url_image = result.secure_url;
            const product = await CreateProducts(num_referencia,category,url_image,description);
            const details = await createDetailsProduct(product.id_producto,name,subcategory,type,colors,size_min,size_max,material);
            res.status(201).json({message: "Producto registrado correctamente", product, details});
            
        }catch(error){
            res.status(500).json({message: "Error en el servidor", error: error.message})
        }
    }
]
