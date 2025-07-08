import pool from "../config/db.js";

export const createDetailsProduct = async(id_producto,name,subcategory,type,size,color) =>{
    const query = `INSERT INTO detalle_producto(id_producto,name,subcategory,type,size,color) VALUES($1,$2,$3,$4,$5,$6)`;
    const values = [id_producto,name,subcategory,type,size,color];
    const result = await pool.query(query,values);
    return result.rows[0];
}