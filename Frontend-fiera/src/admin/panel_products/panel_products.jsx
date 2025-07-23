import { useState, useEffect } from 'react';
import FormAdmin from '../form-admin/FormAdmin';
import { FaSignOutAlt, FaFilter } from 'react-icons/fa';
import './panel_products.css';

const PanelProducts = ({ onLogout }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productoEditar, setProductoEditar] = useState(null);
    const [modo, setModo] = useState('crear');
    const [message, setMessage] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);

    // Lista completa de categorías predefinidas
    const predefinedCategories = [
        'Guayos',
        'Zapatillas',
        'Balones',
        'Licras',
        'Linea Escolar',
    ];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/getproduct`
            );
            const data = await response.json();
            const productsArray = Array.isArray(data) ? data : [];
            setProducts(productsArray);
            setFilteredProducts(productsArray);

            // Combinar categorías de productos con categorías predefinidas
            const productCategories = [
                ...new Set(productsArray.map(product => product.category)),
            ];
            const allCategories = [
                ...new Set([...productCategories, ...predefinedCategories]),
            ];
            setCategories(allCategories);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtrar productos por categoría
    useEffect(() => {
        if (categoryFilter) {
            setFilteredProducts(
                products.filter(product => product.category === categoryFilter)
            );
        } else {
            setFilteredProducts(products);
        }
    }, [categoryFilter, products]);

    const handleCategoryFilter = e => {
        setCategoryFilter(e.target.value);
    };

    const clearFilter = () => {
        setCategoryFilter('');
    };

    const handleRemoveProduct = async id_producto => {
        // Mensaje de confirmación
        const confirmDelete = window.confirm(
            '¿Seguro que deseas eliminar este producto?'
        );
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/deleteProduct/${id_producto}`,
                {
                    method: 'DELETE',
                }
            );
            if (response.ok) {
                setProducts(prev => prev.filter(p => p.id_producto !== id_producto));
                setMessage('Producto eliminado correctamente.'); // Mensaje de éxito
                setTimeout(() => setMessage(''), 3000);
            } else {
                console.log('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error de red', error);
        }
    };

    const handleSelectProduct = product => {
        setProductoEditar(product);
        setModo('editar');
    };

    const handleSubmit = async formData => {
        try {
            const endpoint =
                modo === 'editar'
                    ? `${import.meta.env.VITE_API_URL}/api/updateproduct`
                    : `${import.meta.env.VITE_API_URL}/api/registerproduct`;

            const method = 'POST';

            const response = await fetch(endpoint, {
                method,
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Respuesta con error:', errorText);
                throw new Error('Error al guardar el producto');
            }

            setMessage('Producto añadido con éxito.'); // Mensaje de éxito
            setTimeout(() => setMessage(''), 3000);

            await fetchProducts();
            setProductoEditar(null);
            setModo('crear');
        } catch (error) {
            console.error('❗ Error al guardar el producto', error);
        }
    };

    return (
        <div className="panel-products-container">
            <div className="panel-header">
                <button onClick={onLogout} className="logout-button" type="button">
                    <FaSignOutAlt /> Cerrar sesión
                </button>
            </div>

            {/* Mensaje global */}
            {message && (
                <div
                    className="panel-message"
                    style={{ marginBottom: '1rem', color: '#198754', fontWeight: 'bold' }}
                >
                    {message}
                </div>
            )}

            {/* Formulario de administración */}
            <FormAdmin
                productoEditar={productoEditar}
                onSubmit={handleSubmit}
                modo={modo}
                setModo={setModo}
                extraButtons={
                    <div className="filter-inline">
                        <div className="filter-group">
                            <label>
                                <FaFilter /> Filtrar tabla por:
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryFilter}
                                className="category-filter"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {categoryFilter && (
                                <button onClick={clearFilter} className="clear-filter-btn">
                                    Limpiar filtro
                                </button>
                            )}
                        </div>
                    </div>
                }
            />

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
                    {filteredProducts.map((product, index) => (
                        <tr key={index} className="row_table">
                            <td>{product.num_referencia}</td>
                            <td>{product.category}</td>
                            <td>{product.name}</td>
                            <td>{product.subcategory}</td>
                            <td>{product.type}</td>
                            <td>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        gap: '0.5rem',
                                        marginLeft: '0.5rem',
                                    }}
                                >
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
                            <td>
                                {product.size_min} - {product.size_max}
                            </td>
                            <td>{product.material}</td>
                            <td>
                                <img
                                    className="image_table"
                                    src={product.url_image}
                                    alt={product.name}
                                />
                            </td>
                            <td className="__actions">
                                <div className="container_buttons">
                                    <button onClick={() => handleSelectProduct(product)}>
                                        Seleccionar
                                    </button>
                                    <button
                                        onClick={() => handleRemoveProduct(product.id_producto)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filteredProducts.length === 0 && !loading && (
                <div className="no-products-message">
                    No hay productos que coincidan con el filtro seleccionado.
                </div>
            )}
        </div>
    );
};

export default PanelProducts;
