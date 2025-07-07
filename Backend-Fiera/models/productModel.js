import pool from "../config/db.js";

export const findProducts = async() =>{
        const query = "select * from producto p inner join detalle_producto d on p.id_producto = d.id_producto;"
        const result = await pool.query(query);
        return result.rows;
};
