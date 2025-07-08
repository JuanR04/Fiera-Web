import { useState, useRef, useEffect } from 'react';
import './FormAdmin.css';
import { FaUpload, FaTrash, FaSave, FaPlus, FaTimes } from 'react-icons/fa';

const FormAdmin = () => {
    // Estado para los valores del formulario
    const [formData, setFormData] = useState({
        num_referencia: '',
        category: '',
        description: '',
        name: '',
        subcategory: '',
        type: '',
        size: '',
        material: '',
        colors: ['#000000'],
        url_image: '',

    });

    // Estado para la imagen de vista previa
    const [imagePreview, setImagePreview] = useState(null);

    // Estado para mensajes de error/éxito
    const [message, setMessage] = useState({ text: '', type: '' });

    // Estado para subcategorías disponibles según la categoría seleccionada
    const [availableSubcategories, setAvailableSubcategories] = useState([]);

    // Estado para tipos disponibles según la categoría y subcategoría
    const [availableTypes, setAvailableTypes] = useState([]);

    // Estado para tallas disponibles según la categoría
    const [availableSizes, setAvailableSizes] = useState([]);

    // Estado para validación
    const [errors, setErrors] = useState({});

    // Referencia al input de tipo file
    const fileInputRef = useRef(null);

    // Definición de categorías y subcategorías
    const categories = [
        {
            name: 'Guayos',
            subcategories: ['Amateur', 'Profesional'],
        },
        {
            name: 'Balones',
            subcategories: ['Futbol'],
        },
        {
            name: 'Licras',
            subcategories: ['Deportivas'],
        },
    ];

    // Opciones para tipos según la categoría y subcategoría
    const getTypeOptions = (category, subcategory) => {
        if (category === 'Guayos') {
            if (subcategory === 'Amateur') {
                return ['Zapatilla Futbol Sala FS', 'Botin Zapatilla Futbol Sala', 'Zapatilla Gama Sintetica', 'Botin Zapatilla Gama Sintetica', 'Botin Guayo', 'Guayo'];
            } else if (subcategory === 'Profesional') {
                return ['Botin Guayo', 'Guayo'];
            }
        } else if (category === 'Balones') {
            return ['micro', 'futbol', 'futsala', 'futsalon'];
        } else if (category === 'Licras') {
            return ['buzo', 'licra corta', 'licra larga'];
        }
        return [];
    };

    // Opciones para tallas según la categoría
    const getSizeOptions = category => {
        if (category === 'Guayos') {
            return Array.from({ length: 14 }, (_, i) => (i + 32).toString()); // 32-45
        } else if (category === 'Balones') {
            return ['#3.5', '#4', '#5'];
        } else if (category === 'Licras') {
            return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        }
        return [];
    };

    // Opciones para materiales (solo para guayos)
    const materialOptions = ['cuero', 'sintético'];

    // Actualizar subcategorías cuando cambia la categoría
    useEffect(() => {
        if (formData.category) {
            const category = categories.find(cat => cat.name === formData.category);
            setAvailableSubcategories(category ? category.subcategories : []);

            // Reset subcategory if not in the new list
            if (
                category &&
                category.subcategories.length > 0 &&
                !category.subcategories.includes(formData.subcategory)
            ) {
                setFormData(prev => ({ ...prev, subcategory: '' }));
            }

            // Update available sizes
            setAvailableSizes(getSizeOptions(formData.category));

            // Reset type
            setFormData(prev => ({ ...prev, type: '' }));
            setAvailableTypes([]);
        } else {
            setAvailableSubcategories([]);
            setAvailableSizes([]);
            setAvailableTypes([]);
        }
    }, [formData.category]);

    // Actualizar tipos cuando cambia la subcategoría
    useEffect(() => {
        if (formData.category && formData.subcategory) {
            const types = getTypeOptions(formData.category, formData.subcategory);
            setAvailableTypes(types);

            // Reset type if not in the new list
            if (types.length > 0 && !types.includes(formData.type)) {
                setFormData(prev => ({ ...prev, type: '' }));
            }
        }
    }, [formData.subcategory, formData.category]);

    // Manejar cambios en los inputs
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar error del campo cuando se modifica
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Manejar cambios en el input de archivo
    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            // Crear URL para vista previa
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // En un escenario real, aquí se cargaría a Cloudinary o similar
            // Por ahora simulamos con una URL temporal
            setFormData(prev => ({
                ...prev,
                url_image: URL.createObjectURL(file),
            }));

            // Limpiar error
            if (errors.url_image) {
                setErrors(prev => ({
                    ...prev,
                    url_image: '',
                }));
            }
        }
    };

    // Añadir un nuevo color
    const addColor = () => {
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, '#FFFFFF'],
        }));
    };

    // Cambiar un color existente
    const changeColor = (index, value) => {
        const updatedColors = [...formData.colors];
        updatedColors[index] = value;
        setFormData(prev => ({
            ...prev,
            colors: updatedColors,
        }));
    };

    // Eliminar un color
    const removeColor = index => {
        if (formData.colors.length > 1) {
            const updatedColors = formData.colors.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                colors: updatedColors,
            }));
        }
    };

    // Validar el formulario
    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            'num_referencia',
            'category',
            'name',
            'subcategory',
            'type',
            'size',

        ];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = `El campo ${getFieldLabel(field)} es obligatorio`;
            }
        });

        // Validar material solo para guayos
        if (formData.category === 'Guayos' && !formData.material) {
            newErrors.material = 'El material es obligatorio para guayos';
        }

        if (!formData.url_image && !imagePreview) {
            newErrors.url_image = 'La imagen es obligatoria';
        }

        if (formData.colors.length === 0) {
            newErrors.colors = 'Debe seleccionar al menos un color';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Obtener etiqueta para mensajes de error
    const getFieldLabel = field => {
        const labels = {
            num_referencia: 'Número de referencia',
            category: 'Categoría',
            name: 'Nombre',
            subcategory: 'Subcategoría',
            type: 'Tipo',
            size: 'Talla',
            material: 'Material',
            colors: 'Colores',
            url_image: 'Imagen',

        };
        return labels[field] || field;
    };

    // Limpiar formulario
    const handleReset = () => {
        setFormData({
            num_referencia: '',
            category: '',
            description: '',
            name: '',
            subcategory: '',
            type: '',
            size: '',
            material: '',
            colors: ['#000000'],
            url_image: '',

        });
        setImagePreview(null);
        setErrors({});
        setMessage({ text: '', type: '' });

        // Limpiar input file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Enviar formulario
    const handleSubmit = async e => {
        e.preventDefault();

        if (validateForm()) {
            try {
                setMessage({ text: 'Enviando datos...', type: 'info' });

                // Preparar datos según la categoría
                const productData = { ...formData };

                // Simular envío al backend
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/product`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(productData),
                    }
                );

                if (response.ok) {
                    setMessage({
                        text: '¡Producto registrado con éxito!',
                        type: 'success',
                    });
                    handleReset(); // Limpiar formulario tras éxito
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Error al registrar el producto');
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage({ text: `Error: ${error.message}`, type: 'error' });
            }
        } else {
            setMessage({
                text: 'Por favor, complete todos los campos obligatorios',
                type: 'error',
            });
        }
    };

    return (
        <div className="form-admin-container">
            <div className="form-admin-header">
                <img
                    src="/logo_fiera.png"
                    alt="Logo Fiera"
                    className="form-admin-logo"
                />
                <h2>Registro de Productos</h2>
            </div>

            {message.text && (
                <div className={`form-message ${message.type}`}>{message.text}</div>
            )}

            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-layout">
                    <div className="form-col">
                        {/* Imagen */}
                        <div className="form-group image-upload-group">
                            <label>Imagen del producto*</label>
                            <div className="image-preview-container">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Vista previa"
                                        className="image-preview"
                                    />
                                ) : (
                                    <div className="image-placeholder">
                                        <FaUpload />
                                        <span>Subir imagen</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <button
                                type="button"
                                className="browse-button"
                                onClick={() => fileInputRef.current.click()}
                            >
                                Seleccionar imagen
                            </button>
                            {errors.url_image && (
                                <span className="error-message">{errors.url_image}</span>
                            )}
                        </div>

                        {/* Número de referencia */}
                        <div className="form-group">
                            <label htmlFor="num_referencia">Número de referencia*</label>
                            <input
                                type="text"
                                id="num_referencia"
                                name="num_referencia"
                                value={formData.num_referencia}
                                onChange={handleChange}
                                placeholder="Ej: G01"
                                className={errors.num_referencia ? 'error' : ''}
                            />
                            {errors.num_referencia && (
                                <span className="error-message">{errors.num_referencia}</span>
                            )}
                        </div>

                        {/* Nombre */}
                        <div className="form-group">
                            <label htmlFor="name">Nombre del producto*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Guayo Profesional"
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && (
                                <span className="error-message">{errors.name}</span>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detalles del producto..."
                                rows="4"
                            />
                        </div>
                    </div>

                    <div className="form-col">
                        {/* Categoría */}
                        <div className="form-group">
                            <label htmlFor="category">Categoría*</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={errors.category ? 'error' : ''}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.name} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <span className="error-message">{errors.category}</span>
                            )}
                        </div>

                        {/* Subcategoría */}
                        <div className="form-group">
                            <label htmlFor="subcategory">Subcategoría*</label>
                            <select
                                id="subcategory"
                                name="subcategory"
                                value={formData.subcategory}
                                onChange={handleChange}
                                disabled={!formData.category}
                                className={errors.subcategory ? 'error' : ''}
                            >
                                <option value="">Seleccionar subcategoría</option>
                                {availableSubcategories.map(sub => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                            </select>
                            {errors.subcategory && (
                                <span className="error-message">{errors.subcategory}</span>
                            )}
                        </div>

                        {/* Tipo */}
                        <div className="form-group">
                            <label htmlFor="type">Tipo*</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                disabled={!formData.subcategory}
                                className={errors.type ? 'error' : ''}
                            >
                                <option value="">Seleccionar tipo</option>
                                {availableTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <span className="error-message">{errors.type}</span>
                            )}
                        </div>

                        {/* Material (solo para guayos) */}
                        {formData.category === 'Guayos' && (
                            <div className="form-group">
                                <label htmlFor="material">Material*</label>
                                <select
                                    id="material"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    className={errors.material ? 'error' : ''}
                                >
                                    <option value="">Seleccionar material</option>
                                    {materialOptions.map(material => (
                                        <option key={material} value={material}>
                                            {material}
                                        </option>
                                    ))}
                                </select>
                                {errors.material && (
                                    <span className="error-message">{errors.material}</span>
                                )}
                            </div>
                        )}

                        {/* Talla */}
                        <div className="form-group">
                            <label htmlFor="size">Talla*</label>
                            <select
                                id="size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                disabled={!formData.category}
                                className={errors.size ? 'error' : ''}
                            >
                                <option value="">Seleccionar talla</option>
                                {availableSizes.map(size => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            {errors.size && (
                                <span className="error-message">{errors.size}</span>
                            )}
                        </div>

                        {/* Colores */}
                        <div className="form-group">
                            <label>Colores*</label>
                            <div className="colors-container">
                                {formData.colors.map((color, index) => (
                                    <div key={index} className="color-item">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={e => changeColor(index, e.target.value)}
                                            className="color-picker"
                                        />
                                        <button
                                            type="button"
                                            className="remove-color-btn"
                                            onClick={() => removeColor(index)}
                                            disabled={formData.colors.length === 1}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="add-color-btn"
                                    onClick={addColor}
                                >
                                    <FaPlus /> Añadir color
                                </button>
                            </div>
                            {errors.colors && (
                                <span className="error-message">{errors.colors}</span>
                            )}

                            <div className="color-preview">
                                {formData.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className="color-chip"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="reset-button" onClick={handleReset}>
                        <FaTrash /> Limpiar
                    </button>
                    <button type="submit" className="submit-button">
                        <FaSave /> Guardar producto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormAdmin;
