import pool from "../config/db.js";

export const createDetailsProduct = async(id_producto,name,subcategory,type,color,size_min,size_max,material) =>{
    const query = `INSERT INTO detalle_producto(id_producto,name,subcategory,type,color,size_min,size_max,material) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`;
    const values = [id_producto,name,subcategory,type,color,size_min,size_max,material];
    const result = await pool.query(query,values);
    return result.rows[0];
}