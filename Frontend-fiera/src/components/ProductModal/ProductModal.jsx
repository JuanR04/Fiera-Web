import './ProductModal.css';
import { FaTimes } from 'react-icons/fa';

const ProductModal = ({ product, isOpen, onClose }) => {
    if (!isOpen || !product) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
      <div className="product-modal-overlay" onClick={handleOverlayClick}>
        <div className="product-modal">
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>

          <div className="modal-content">
            {/* Imagen del producto */}
            <div className="modal-image-section">
              <div className="modal-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="modal-product-image"
                />
              </div>
            </div>

            {/* Información del producto */}
            <div className="modal-info-section">
              <h2 className="modal-product-name">{product.name}</h2>

              <div className="modal-price">
                <span className="current-price">{product.price}</span>
              </div>

              <div className="modal-description">
                <h3>Descripción</h3>
                <p>{product.description}</p>
              </div>

              <div className="modal-details">
                <div className="detail-item">
                  <strong>Categoría:</strong> {product.category}
                </div>
                <div className="detail-item">
                  <strong>Tipo:</strong> {product.subcategory}
                </div>
                <div className="detail-item">
                  <strong>Edad:</strong>{' '}
                  {product.ageGroup === 'adulto' ? 'Adulto' : 'Niño'}
                </div>
                <div className="detail-item">
                  <strong>Num Referencia:</strong> {product.num_referencia}
                </div>
                <div className="detail-item">
                  <strong>Talla:</strong> {product.size}
                </div>
                <div className="detail-item">
                  <strong>Color:</strong> {product.color}
                </div>
              </div>

              <div className="modal-info">
                <p>
                  <strong>Disponible en tienda física</strong>
                </p>
                <p>Visítanos para ver y probar el producto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ProductModal;