import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const CatalogContext = createContext();

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState([]); // lista con filtros
  const [product, setProduct] = useState([]); // lista sin filtros
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    ageGroup: '',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(''); // Estado para término de búsqueda

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getproduct`)
      .then(res => res.json())
      .then(data => {
        console.log('Datos del backend', data);
        setProduct(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
        setLoading(false);
      });
  }, []);

  // Función para buscar productos
  const searchProducts = query => {
    if (!query || !query.trim()) return product;

    const searchTerms = query.toLowerCase().trim().split(/\s+/);

    return product.filter(item => {
      // Buscar en múltiples campos
      const searchableText = [
        item.name || '',
        item.description || '',
        item.category || '',
        item.subcategory || '',
        item.type || '',
        item.material || '',
        item.num_referencia || '',
      ]
        .join(' ')
        .toLowerCase();

      // Un producto coincide si contiene TODOS los términos de búsqueda
      return searchTerms.every(term => searchableText.includes(term));
    });
  };

  // Función para aplicar búsqueda
  const applySearch = query => {
    if (!query.trim()) {
      setSearchTerm('');
      fetchProducts(filters);
      return;
    }

    // Guardar búsqueda reciente
    saveRecentSearch(query);

    // Aplicar búsqueda
    setSearchTerm(query);
    setLoading(true);
    const results = searchProducts(query);
    setProducts(results);
    setLoading(false);

    // Actualizar URL y limpiar filtros
    setFilters({ category: '', subcategory: '', ageGroup: '' });
    setSearchParams({ q: query });
  };

  // Guardar búsqueda reciente
  const saveRecentSearch = query => {
    if (!query.trim()) return;

    try {
      const recentSearches = JSON.parse(
        localStorage.getItem('recentSearches') || '[]'
      );
      const updatedSearches = [
        query,
        ...recentSearches.filter(s => s !== query),
      ].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error guardando búsqueda reciente:', error);
    }
  };

  // Obtener búsquedas recientes
  const getRecentSearches = () => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch (error) {
      console.error('Error al obtener búsquedas recientes:', error);
      return [];
    }
  };

  // Función para filtrar productos
  const fetchProducts = async (currentFilters = filters) => {
    setLoading(true);

    try {
      // Limpiar término de búsqueda cuando se aplican filtros
      if (searchTerm) {
        setSearchTerm('');
        setSearchParams(
          Object.fromEntries(
            Object.entries(currentFilters).filter(([_, v]) => v)
          )
        );
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));

      let filteredProducts = [...product];

      // Aplicar filtros
      if (currentFilters.category) {
        filteredProducts = filteredProducts.filter(
          p => p.category === currentFilters.category
        );
      }
      if (currentFilters.subcategory) {
        filteredProducts = filteredProducts.filter(
          p => p.subcategory === currentFilters.subcategory
        );
      }
      if (currentFilters.ageGroup) {
        filteredProducts = filteredProducts.filter(
          p => p.ageGroup === currentFilters.ageGroup
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Al cargar, lee los filtros o búsqueda de la URL
  useEffect(() => {
    const query = searchParams.get('q') || '';

    if (query) {
      // Si hay una búsqueda en la URL
      setSearchTerm(query);
      const results = searchProducts(query);
      setProducts(results);
    } else {
      // Si no hay búsqueda, aplicar filtros normales
      const category = searchParams.get('category') || '';
      const subcategory = searchParams.get('subcategory') || '';
      const ageGroup = searchParams.get('ageGroup') || '';
      const urlFilters = { category, subcategory, ageGroup };
      setFilters(urlFilters);
      fetchProducts(urlFilters);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  const applyFilter = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    if (filterType === 'category') newFilters.subcategory = '';

    setFilters(newFilters);
    setSearchParams(
      Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v))
    );
    fetchProducts(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: '', subcategory: '', ageGroup: '' };
    setFilters(clearedFilters);
    setSearchParams({});
    fetchProducts(clearedFilters);
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        loading,
        filters,
        searchTerm,
        applyFilter,
        clearFilters,
        applySearch,
        getRecentSearches,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};
