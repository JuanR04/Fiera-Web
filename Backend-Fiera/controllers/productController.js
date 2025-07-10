import {findProducts, CreateProducts, findProductById, deleteProducts} from "../models/productModel.js";
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
// Controlador para obtener un producto por ID
export const getProductById = async(req, res) => {
    try {
        const { id } = req.params;// obtener el id del producto desde los parametros de la URL.
        const product = await findProductById(id);// buscar el producto por su ID en la base de datos.
        
        if (!product) { // Si el producto no existe, se retorna un error  
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({
            message: "Error en el servidor al obtener el producto",
            error: error.message
        });
    }
};
// Controlador para la eliminacion  de productos:
export const deleteProductById = async(req,res)=>{
    try{
        const {id} = req.params; // Aqui se obtiene el id de los parametros de la URL, la cual es enviada desde el cliente.

        // verficar si el producto existe:
        const product = await findProductById(id);
        if(!product){
            return res.status(404).json({message: "No se encontró el producto"});
        }
        // Si hay una imagen en cloudinary eliminarla:
        if(product.url_image){
            // Se extrae el public_id de la URL de la imagen para eliminarla de Cloudinary.
            const publicId = product.url_image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        // Eliminar el producto:
        const deleteProduct = await deleteProducts(id);

        // status 200 indica que la solicitud se ha procesado correctamente.
        res.status(200).json({message: "Producto eliminado correctamente", product: deleteProduct});// Se envia el producto eliminado como respuesta.

    }catch(error){
        res.status(500).json({message: "Error en el servidor", error: error.message});
    }
}
