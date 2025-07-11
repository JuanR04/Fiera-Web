import { findProducts, CreateProducts, UpdateProductsId } from "../models/productModel.js";
import { createDetailsProduct, UpdateDetailsProduct } from "../models/productDetailModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import multer from 'multer';
import pool from "../config/db.js";


const upload = multer({ dest: 'uploads/' });

export const getProducts = async (req, res) => {
    try {
        const products = await findProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error en el sevidor", error: error.message })
    }
}

export const registerProduct = [
    upload.single('image'),
    async (req, res) => {
        console.log(req.body);
        const { num_referencia, category, description, name, subcategory, type, size_min, size_max, material, colors } = req.body;

        if (
            !num_referencia ||
            !category ||
            !name ||
            !subcategory ||
            !type ||
            !size_min ||
            !size_max ||
            !material ||
            !colors
        ) {
            return res.status(400).json({ message: "Todos los campos son obligatorios excepto la descripción." });
        }

        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            const url_image = result.secure_url;
            const product = await CreateProducts(num_referencia, category, url_image, description);
            const details = await createDetailsProduct(product.id_producto, name, subcategory, type, colors, size_min, size_max, material);
            res.status(201).json({ message: "Producto registrado correctamente", product, details });

        } catch (error) {
            res.status(500).json({ message: "Error en el servidor", error: error.message })
        }
    }
]

export const UpdateProduct = [upload.single('image'),
async (req, res) => {
    const { id_detalle, id_producto, num_referencia, category, description, name, subcategory, type, size_min, size_max, material, colors } = req.body;
    if (
        !num_referencia ||
        !category ||
        !name ||
        !subcategory ||
        !type ||
        !size_min ||
        !size_max ||
        !material ||
        !colors
    ) {
        return res.status(400).json({ message: "Todos los campos son obligatorios excepto la descripción." });
    }
    try {
        const { rows } = await pool.query('SELECT url_image FROM producto WHERE id_producto=$1', [id_producto]);
        const oldimageurl = rows[0]?.url_image;

        const result = await cloudinary.uploader.upload(req.file.path);
        const url_image = result.secure_url;

        const updatedProduct = await UpdateProductsId(id_producto, num_referencia, category, url_image, description);
        const updateDetails = await UpdateDetailsProduct(id_detalle, name, subcategory, type, colors, size_min, size_max, material);

        if (oldimageurl) {
            const publicId = product.url_image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);

        }
        res.status(201).json({ message: "productos actualizados correctamente", updateDetails, updatedProduct })

    } catch (error) {
        res.status(500).json({ message: "error de servidor", error: error.message })
    }


}]
