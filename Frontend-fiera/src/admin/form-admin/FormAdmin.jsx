// FormAdmin.jsx (actualizado con correcciones para cargar tipo al editar)
import { useState, useRef, useEffect } from 'react';
import './FormAdmin.css';
import DashboardAdmin from '../dashboard_admin';
import {
    FaUpload,
    FaTrash,
    FaSave,
    FaPlus,
    FaTimes,
    FaSignOutAlt,
} from 'react-icons/fa';


const FormAdmin = ({ onLogout, productoEditar = null, onSubmit, modo = 'crear', setModo }) => {

    const [formData, setFormData] = useState({
        id_producto: '',
        id_detalle: '',
        num_referencia: '',
        category: '',
        description: '',
        name: '',
        subcategory: '',
        type: '',
        size_min: '',
        size_max: '',
        material: '',
        colors: ['#000000'],

        ...productoEditar,

    });

    const [imagePreview, setImagePreview] = useState(productoEditar?.url_image || null);
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [availableTypes, setAvailableTypes] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const categories = [
        { name: 'Guayos', subcategories: ['Amateur', 'Profesional'] },
        { name: 'Balones', subcategories: ['Futbol'] },
        { name: 'Licras', subcategories: ['Deportivas'] },
    ];

    const getTypeOptions = (category, subcategory) => {
        if (category === 'Guayos') {
            if (subcategory === 'Amateur') {
                return [
                    'Zapatilla Futbol Sala FS',
                    'Botin Zapatilla Futbol Sala',
                    'Zapatilla Gama Sintetica',
                    'Botin Zapatilla Gama Sintetica',
                    'Botin Guayo',
                    'Guayo',
                ];
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

    const getSizeOptions = category => {
        if (category === 'Guayos') return Array.from({ length: 14 }, (_, i) => (i + 32).toString());
        if (category === 'Balones') return ['#3.5', '#4', '#5'];
        if (category === 'Licras') return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        return [];
    };

    const materialOptionsByCategory = {
        Guayos: ['cuero', 'sintético'],
        Balones: ['sintético'],
        Licras: ['tela licra'],
    };

    useEffect(() => {
        if (formData.category) {
            const category = categories.find(cat => cat.name === formData.category);
            setAvailableSubcategories(category ? category.subcategories : []);

            if (category && !category.subcategories.includes(formData.subcategory)) {
                setFormData(prev => ({ ...prev, subcategory: '' }));
            }

            setAvailableSizes(getSizeOptions(formData.category));

            const types = getTypeOptions(formData.category, formData.subcategory);
            setAvailableTypes(types);

            if (!productoEditar && !types.includes(formData.type)) {
                setFormData(prev => ({ ...prev, type: '' }));
            }
        }
    }, [formData.category]);

    useEffect(() => {
        if (formData.category && formData.subcategory) {
            const types = getTypeOptions(formData.category, formData.subcategory);
            setAvailableTypes(types);

            if (!types.includes(formData.type)) {
                setFormData(prev => ({ ...prev, type: '' }));
            }
        }
    }, [formData.subcategory, formData.category]);

    useEffect(() => {
        if (productoEditar) {
            const colorArray = typeof productoEditar.color === 'string'
                ? productoEditar.color.split(',').map(c => c.trim())
                : ['#000000'];

            const subcats = categories.find(cat => cat.name === productoEditar.category)?.subcategories || [];
            const sizes = getSizeOptions(productoEditar.category);
            const types = getTypeOptions(productoEditar.category, productoEditar.subcategory);

            setAvailableSubcategories(subcats);
            setAvailableSizes(sizes);
            setAvailableTypes(types);

            setFormData(prev => ({
                ...prev,
                ...productoEditar,
                id_producto: parseInt(productoEditar.id_producto),
                id_detalle: parseInt(productoEditar.id_detalle),
                colors: colorArray,
            }));

            setImagePreview(productoEditar.url_image || null);
        }
    }, [productoEditar]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setImageFile(file);
            if (errors.url_image) setErrors(prev => ({ ...prev, url_image: '' }));
        }
    };

    const addColor = () => setFormData(prev => ({ ...prev, colors: [...prev.colors, '#FFFFFF'] }));

    const changeColor = (index, value) => {
        const updatedColors = [...formData.colors];
        updatedColors[index] = value;
        setFormData(prev => ({ ...prev, colors: updatedColors }));
    };

    const removeColor = index => {
        if (formData.colors.length > 1) {
            const updatedColors = formData.colors.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, colors: updatedColors }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            'num_referencia',
            'category',
            'name',
            'subcategory',
            'type',
            'size_min',
            'size_max',
        ];
        requiredFields.forEach(field => {
            if (!formData[field]) newErrors[field] = `El campo ${field} es obligatorio`;
        });
        if (formData.category === 'Guayos' && !formData.material) newErrors.material = 'Material requerido';
        if (!formData.url_image && !imagePreview) newErrors.url_image = 'Imagen requerida';
        if (!formData.colors.length) newErrors.colors = 'Debe seleccionar al menos un color';
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
            size_min: '',
            size_max: '',
            material: '',
            colors: ['#000000'],
        });

        setImagePreview(null);
        setErrors({});
        setMessage({ text: '', type: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (setModo) setModo('crear');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;


        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'colors') {
                    data.append('colors', value.join(','));
                } else if (['size_min', 'size_max', 'id_producto', 'id_detalle'].includes(key)) {
                    const simpleValue = Array.isArray(value) ? value[0] : value;
                    data.append(key, simpleValue.toString());
                } else if (key !== 'url_image') {
                    data.append(key, value);

                    if (validateForm()) {
                        try {
                            setMessage({ text: 'Enviando datos...', type: 'info' });

                            // Usa FormData para enviar todo, incluyendo el archivo
                            const data = new FormData();
                            Object.entries(formData).forEach(([key, value]) => {
                                // Si el campo es colors (array), lo conviertes a string
                                if (key === 'colors' && Array.isArray(value)) {
                                    data.append(key, value.join(','));
                                } else if (key !== 'url_image') {
                                    // No envíes url_image
                                    data.append(key, value);
                                }
                            });
                            if (imageFile) data.append('image', imageFile); // Aquí va el archivo

                            const response = await fetch(
                                `${import.meta.env.VITE_API_URL}/api/registerproduct`,
                                {
                                    method: 'POST',
                                    body: data,
                                }
                            );

                            if (response.ok) {
                                setMessage({
                                    text: '¡Producto registrado con éxito!',
                                    type: 'success',
                                });
                                handleReset();
                            } else {
                                const error = await response.json();
                                throw new Error(error.message || 'Error al registrar el producto');

                            }
                        });
            if (imageFile) data.append('image', imageFile);
            await onSubmit(data);
            handleReset();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };

    const materialOptions = materialOptionsByCategory[formData.category] || [];

    return (
        <div className="form-admin-container">
            <div className="form-admin-header">
                <img
                    src="/logo_fiera.png"
                    alt="Logo Fiera"
                    className="form-admin-logo"
                />
                <h2>Registro de Productos</h2>
                <button onClick={onLogout} className="logout-button" type="button">
                    <FaSignOutAlt /> Cerrar sesión
                </button>
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
                        {['Guayos', 'Balones', 'Licras'].includes(formData.category) && (
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
                        <div className="size_group">
                            <div className="form-group _smin">
                                <label htmlFor="size">Talla mínima</label>
                                <select
                                    id="size_min"
                                    name="size_min"
                                    value={formData.size_min}
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
                            <div className="form-group _smax">
                                <label htmlFor="size">Talla máxima</label>
                                <select
                                    id="size_max"
                                    name="size_max"
                                    value={formData.size_max}
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
                        <FaSave /> {modo === 'editar' ? 'Actualizar producto' : 'Guardar producto'}
                    </button>
                </div>
            </form>
            <DashboardAdmin />
        </div>
    );
};

export default FormAdmin;
