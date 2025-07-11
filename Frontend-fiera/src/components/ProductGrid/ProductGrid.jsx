import './ProductGrid.css';
import { useCatalog } from '../../context/CatalogContext';

const ProductGrid = ({ // Configuración de la grilla
    columns = { mobile: 1, tablet: 2, desktop: 3 }, 
    onProductClick,
    className = '' 
}) => {
    const { products, loading } = useCatalog(); // Obtener productos y estado de carga del contexto

    if (loading) { // Mostrar spinner de carga
        return (
            <div className="product-grid-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) { // si no hay productos, mostrar mensaje
        return (
            <div className="product-grid-empty">
                <p>No se encontraron productos con los filtros seleccionados.</p>
            </div>
        );
    }

    return ( // Renderizar grilla de productos
        <div className={`product-grid ${className}`} style={{ // Estilos responsivos
            '--mobile-columns': columns.mobile,
            '--tablet-columns': columns.tablet,
            '--desktop-columns': columns.desktop
        }}>
            {products.map((product,index) => ( // Iterar sobre productos
                // Renderizar cada producto
                <div key={index}>
                    <div 
                        className="product-card"
                        onClick={() => onProductClick && onProductClick(product)}
                    >
                        <div className="product-image-container">
                            <img 
                                src={product.url_image} 
                                alt={product.name}
                                className="product-image"
                            />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;