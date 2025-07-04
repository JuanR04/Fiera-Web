import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

const CatalogContext = createContext();

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    ageGroup: '' 
  });
  const [searchParams, setSearchParams] = useSearchParams();

  // Simulación de API - aquí irá tu lógica real de base de datos
  const mockProducts = [
    { id: 1, name: "Guayo Profesional", image: "https://i.pinimg.com/736x/bd/16/01/bd16012802a151cd3a63fc6032aa694d.jpg", price: "$150.000", category: "Guayos", subcategory: "Profesionales", ageGroup: "adulto", description: "Guayo profesional de alta calidad para jugadores exigentes." },
    { id: 2, name: "Balón Fut-sala", image: "https://i.pinimg.com/736x/03/65/9d/03659dd333ec9f2ff2a04ba5d870672f.jpg", price: "$80.000", category: "Balones", subcategory: "Fut-sala", ageGroup: "adulto", description: "Balón oficial para futsal con excelente control." },
    { id: 3, name: "Licra Deportiva", image: "https://i.pinimg.com/736x/d3/63/a9/d363a99dc7fff34f022672c21accfc24.jpg", price: "$45.000", category: "Licras", subcategory: "Camisetas", ageGroup: "adulto", description: "Licra deportiva transpirable y cómoda." },
    { id: 4, name: "Guayo Amateur", image: "https://i.pinimg.com/736x/32/fa/2a/32fa2aed133256611a4827c94777b254.jpg", price: "$95.000", category: "Guayos", subcategory: "Amateur", ageGroup: "adulto", description: "Guayo ideal para jugadores amateur y entrenamientos." },
    { id: 5, name: "Guayo Niños", image: "https://i.pinimg.com/736x/f7/61/92/f7619205c0d6b5370d6b2aa94c378892.jpg", price: "$70.000", category: "Guayos", subcategory: "Niños", ageGroup: "niño", description: "Guayo especialmente diseñado para niños." },
    { id: 6, name: "Balón Training", image: "https://i.pinimg.com/736x/0c/13/59/0c13590c29c93f3813ff77f67321b06f.jpg", price: "$90.000", category: "Balones", subcategory: "Training", ageGroup: "adulto", description: "Balón resistente para entrenamientos intensivos." },
    { id: 7, name: "Camiseta Fiera", image: "https://i.pinimg.com/736x/e6/ae/0f/e6ae0f1f5813564e01b32af9c2c64a05.jpg", price: "$65.000", category: "Licras", subcategory: "Camisetas", ageGroup: "adulto", description: "Camiseta oficial de la marca Fiera." },
    { id: 8, name: "Balón Micro", image: "https://i.pinimg.com/736x/31/2e/51/312e5127b520017b82aefa309143acb6.jpg", price: "$60.000", category: "Balones", subcategory: "Micro", ageGroup: "niño", description: "Balón tamaño micro ideal para niños pequeños." },
  ];

  // Función para filtrar productos (simula consulta a BD)
  const fetchProducts = async (currentFilters = filters) => {
    setLoading(true);
    
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredProducts = [...mockProducts];

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