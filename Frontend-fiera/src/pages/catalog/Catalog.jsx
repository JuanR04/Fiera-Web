import './Catalog.css';
import { useState } from 'react';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useCatalog } from '../../context/CatalogContext';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import ProductModal from '../../components/ProductModal/ProductModal';
import CarouselD from '../../components/corousel/desktop/Carousel';
import Pagination from '../../components/Pagination/Pagination';

const Catalog = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Estado para manejar la visibilidad de los filtros
  const [openedCategories, setOpenedCategories] = useState({}); // Estado para manejar las categorías abiertas
  const [openedSubCategories, setopenedSubCategories] = useState({}); //Estado para manejar las subcategorías abiertas
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para manejar el producto seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la visibilidad del modal

  const {
    filters,
    applyFilter,
    clearFilters,
    searchTerm,
    currentPage,
    totalPages,
    changePage,
    nextPage,
    prevPage,
    totalProducts,
  } = useCatalog(); // Obtener filtros y funciones del contexto

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen); // Función para alternar la visibilidad de los filtros
  const closeFilter = () => setIsFilterOpen(false); // Función para cerrar los filtros

  const toggleCategory = category => {
    // Función para alternar la visibilidad de las subcategorías
    setOpenedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Manejar click en producto para abrir modal
  const handleProductClick = product => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Manejar click en categoría principal
  const handleCategoryClick = categoryName => {
    if (filters.category === categoryName) {
      applyFilter('category', '');
    } else {
      applyFilter('category', categoryName);
    }
    if (window.innerWidth <= 768) closeFilter(); 
  };

  const handleSubCategoryClick = subcategory => {
    // Recibe el objeto subcategoría
    if (filters.subcategory === subcategory.name) {
      applyFilter('subcategory', '');
    } else {
      applyFilter('subcategory', subcategory.name);
      // Opcional: abrir/cerrar la lista de tipos
      setopenedSubCategories(prev => ({
        ...prev,
        [subcategory.name]: !prev[subcategory.name],
      }));
    }
    if (window.innerWidth <= 768) closeFilter(); 
  };

  // Añade esta función que falta
  const handleTypeClick = type => {
    if (filters.type === type) {
      applyFilter('type', '');
    } else {
      applyFilter('type', type);
    }
    if (window.innerWidth <= 768) closeFilter(); 
  };

  const filterCategories = [
    {
      name: 'Balones',
      subcategories: [
        {
          name: 'Futbol',
          types: ['Micro', 'Fut-sala', 'Futbol', 'Fut-salón'],
        },
      ],
    },
    {
      name: 'Guayos',
      subcategories: [
        {
          name: 'Profesional',
          types: ['Botin Guayo', 'Guayo'],
        },
        {
          name: 'Amateur',
          types: [
            'Botin Guayo',
            'Guayo',
          ],
        },
      ],
    },
    {
      name:'Zapatillas',
      subcategories:[
        {
          name:'Grama Sintética',
          types:['Botín','Normal']
        },
        {
          name:'Futbol Sala',
          types:['Botín','Normal']
        }
      ]
    },
    {
      name: 'Licras',
      subcategories: [
        {
          name: 'Deportivas',
          types: ['Buzo', 'Licra corta', 'Licra larga'],
        },
      ],
    },
  ];

  return (
    <div className="catalog-container">
      {/* Banner principal */}
      <header className="catalog-banner">
        <CarouselD />
      </header>

      {/* Título de búsqueda */}
      {searchTerm && (
        <div className="search-results-title">
          <h2>Resultados para: "{searchTerm}"</h2>
        </div>
      )}

      {/* Filtros móviles */}
      <div className="mobile-filters">
        <button className="filter-mobile-btn" onClick={toggleFilter}>
          <FaFilter /> Filtros
        </button>

        {/* Combobox de edad */}
        <select
          className="age-filter-mobile"
          value={filters.ageGroup}
          onChange={e => applyFilter('ageGroup', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="adulto">Adulto</option>
          <option value="niño">Niño</option>
        </select>
      </div>

      <div className="catalog-layout">
        {/* Barra lateral */}
        <aside className={`catalog-sidebar ${isFilterOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>Filtros</h2>
            <button className="close-filter-btn" onClick={closeFilter}>
              <FaTimes />
            </button>
          </div>

          {/* Filtro de edad en sidebar */}
          <div className="age-filter-desktop">
            <h3>Edad</h3>
            <select
              className="age-select"
              value={filters.ageGroup}
              onChange={e => applyFilter('ageGroup', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="adulto">Adulto</option>
              <option value="niño">Niño</option>
            </select>
          </div>

          {/* Filtros de categorías */}
          <div className="filter-categories">
            <div className="filter-header">
              <h3>Categorías</h3>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Limpiar
              </button>
            </div>

            {filterCategories.map((category, index) => (
              <div key={index} className="filter-category">
                {/* Botón de categoría */}
                <button
                  className={`category-button ${
                    filters.category === category.name ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <span>{category.name}</span>
                  {category.subcategories.length > 0 && (
                    <span
                      className="category-toggle"
                      onClick={e => {
                        e.stopPropagation();
                        toggleCategory(category.name);
                      }}
                    >
                      {openedCategories[category.name] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                  )}
                </button>

                {/* Contenedor de subcategorías */}
                {category.subcategories.length > 0 && (
                  <div
                    className={`subcategories ${
                      openedCategories[category.name] ? 'open' : ''
                    }`}
                  >
                    {category.subcategories.map((sub, subIndex) => (
                      <div key={subIndex} className="subcategory-wrapper">
                        {/* Botón de subcategoría */}
                        <button
                          className={`subcategory-button ${
                            filters.subcategory === sub.name ? 'active' : ''
                          }`}
                          onClick={() => handleSubCategoryClick(sub)}
                        >
                          <span>{sub.name}</span>
                          {sub.types && sub.types.length > 0 && (
                            <span
                              className="subcategory-toggle"
                              onClick={e => {
                                e.stopPropagation();
                                setopenedSubCategories(prev => ({
                                  ...prev,
                                  [sub.name]: !prev[sub.name],
                                }));
                              }}
                            >
                              {openedSubCategories[sub.name] ? (
                                <FaChevronUp style={{ fontSize: '12px' }} />
                              ) : (
                                <FaChevronDown style={{ fontSize: '12px' }} />
                              )}
                            </span>
                          )}
                        </button>

                        {/* Tipos de la subcategoría */}
                        {Array.isArray(sub.types) && sub.types.length > 0 && (
                          <div
                            className={`types ${
                              openedSubCategories[sub.name] ? 'open' : ''
                            }`}
                          >
                            {sub.types.map((type, typeIndex) => (
                              <button
                                key={typeIndex}
                                className={`type-button ${
                                  filters.type === type ? 'active' : ''
                                }`}
                                onClick={() => handleTypeClick(type)}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Área principal de productos */}
        <main className="catalog-main">
          {/* Indicadores de filtros activos */}
          {(filters.category || filters.subcategory || filters.ageGroup) && (
            <div className="active-filters">
              <h3>Filtros activos:</h3>
              <div className="filter-tags">
                {filters.category && (
                  <span className="filter-tag">
                    {filters.category}
                    <button onClick={() => applyFilter('category', '')}>
                      ×
                    </button>
                  </span>
                )}
                {filters.subcategory && (
                  <span className="filter-tag">
                    {filters.subcategory}
                    <button onClick={() => applyFilter('subcategory', '')}>
                      ×
                    </button>
                  </span>
                )}
                {filters.ageGroup && (
                  <span className="filter-tag">
                    {filters.ageGroup === 'adulto' ? 'Adulto' : 'Niño'}
                    <button onClick={() => applyFilter('ageGroup', '')}>
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Grid de productos */}
          <ProductGrid
            columns={{ mobile: 2, tablet: 3, desktop: 5 }}
            onProductClick={handleProductClick}
            showPromotion={true}
            promotionAfter={6}
            searchTerm={searchTerm}
          />

          {/* Mostrar resumen de productos si hay resultados */}
          {totalProducts > 0 && (
            <div className="products-summary">
              {totalProducts === 1 ? (
                <span>Mostrando el único producto disponible</span>
              ) : (
                <span>
                  Página {currentPage} de {totalPages}
                </span>
              )}
            </div>
          )}

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            className="catalog-pagination"
          />
        </main>
      </div>

      {/* Overlay para móvil */}
      {isFilterOpen && (
        <div className="filter-overlay" onClick={closeFilter}></div>
      )}

      {/* Modal de producto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Catalog;
