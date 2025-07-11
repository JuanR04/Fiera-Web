import { useState } from "react";
import "./panel_products.css";
import { useEffect } from "react";

const PanelProducts = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/getproduct`)
            .then(res => res.json())
            .then(data => {
                console.log("Datos del backend", data);
                setProducts(Array.isArray(data) ? data : [])
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener los productos:", error);
                setLoading(false);
            });

    }, []);

    return (
        <table className="Table_products">
            <thead>
                <tr className="row_table __head">
                    <th>N° referencia</th>
                    <th>Categoria</th>
                    <th>Nombre</th>
                    <th>SubCategoria</th>
                    <th>Tipo</th>
                    <th>Color</th>
                    <th>Talla</th>
                    <th>Material</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr hey={index} className="row_table">
                        <td >{product.num_referencia}</td>
                        <td>{product.category}</td>
                        <td>{product.name}</td>
                        <td>{product.subcategory}</td>
                        <td>{product.type}</td>
                        <td>
                            <span style={{ display: 'inline-flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
                                {product.color &&
                                    product.color.split(',').map((hex, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                display: 'inline-block',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: hex.trim(),
                                                border: '1px solid #ccc',
                                            }}
                                            title={hex.trim()}
                                        />
                                    ))}
                            </span>
                        </td>
                        <td>{product.size_min} - {product.size_max}</td>
                        <td>{product.material}</td>
                        <td> <img className="image_table" src={product.url_image} alt={product.name} /> </td>
                        <td className="__actions"> <button> seleccionar </button> <button> Eliminar </button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default PanelProducts;