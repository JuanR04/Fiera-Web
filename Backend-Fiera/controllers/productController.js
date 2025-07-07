import {findProducts} from "../models/productModel.js";


export const getProducts = async(req,res) =>{
    try{
        const products = await findProducts();
        res.status(200).json(products);
    }catch(error){
        res.status(500).json({message:"Error en el sevidor", error:error.message})
    }
}

