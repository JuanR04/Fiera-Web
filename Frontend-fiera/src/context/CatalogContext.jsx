import { createContext, useContext, useState, useEffect } from 'react';
import { data, useSearchParams } from "react-router-dom";

const CatalogContext = createContext();

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState([]); //lista con filtros
  const [product, setProduct] = useState([]);//lista sin filtros
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    ageGroup: ''
  });
  const [searchParams, setSearchParams] = useSearchParams();

  // Simulación de API - aquí irá tu lógica real de base de datos
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getproduct`)
      .then(res => res.json())
      .then(data => {
        console.log("Datos del backend",data);
        setProduct(Array.isArray(data) ? data : [])
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
        setLoading(false);
      });

  },[]);

  // Función para filtrar productos (simula consulta a BD)
  const fetchProducts = async (currentFilters = filters) => {
    setLoading(true);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredProducts = [...product];

      // Aplicar filtros
      if (currentFilters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilters.category);
      }
      if (currentFilters.subcategory) {
        filteredProducts = filteredProducts.filter(p => p.subcategory === currentFilters.subcategory);
      }
      if (currentFilters.ageGroup) {
        filteredProducts = filteredProducts.filter(p => p.ageGroup === currentFilters.ageGroup);
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Al cargar, lee los filtros de la URL
  useEffect(() => {
    const category = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";
    const ageGroup = searchParams.get("ageGroup") || "";
    const urlFilters = { category, subcategory, ageGroup };
    setFilters(urlFilters);
    fetchProducts(urlFilters);
    // eslint-disable-next-line
  }, [searchParams]);

  const applyFilter = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    if (filterType === "category") newFilters.subcategory = "";

    setFilters(newFilters);
    setSearchParams(
      Object.fromEntries(
        Object.entries(newFilters).filter(([_, v]) => v) // Solo filtros activos
      )
    );
    fetchProducts(newFilters);
  };

  // Modifica clearFilters para limpiar la URL
  const clearFilters = () => {
    const clearedFilters = { category: "", subcategory: "", ageGroup: "" };
    setFilters(clearedFilters);
    setSearchParams({});
    fetchProducts(clearedFilters);
  };

  return (
    <CatalogContext.Provider value={{
      products,
      loading,
      filters,
      applyFilter,
      clearFilters
    }}>
      {children}
    </CatalogContext.Provider>
  );
};