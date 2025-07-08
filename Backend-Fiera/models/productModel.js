import pool from "../config/db.js";

export const CreateProducts = async (num_referencia,category,url_image,description) =>{
        const query = `INSERT INTO producto(num_referencia,category,url_image,description) VALUES($1,$2,$3,$4) RETURNING *`;
        const values = [num_referencia,category,url_image,description];
        const result = await pool.query(query,values);
        return result.rows[0];
}
export const findProducts = async() =>{
        const query = "select * from producto p inner join detalle_producto d on p.id_producto = d.id_producto;"
        const result = await pool.query(query);
        return result.rows;
};
