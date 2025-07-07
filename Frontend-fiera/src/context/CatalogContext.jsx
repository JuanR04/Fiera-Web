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
    {
      id: 1,
      name: 'Guayo Profesional',
      image:
        'https://res.cloudinary.com/dijh9two4/image/upload/v1751595777/guayo_pf_sisntetico_001_nf_bh4bp9.png',
      price: '$150.000',
      category: 'Guayos',
      subcategory: 'Profesionales',
      ageGroup: 'adulto',
      description:
        'Guayo profesional de alta calidad para jugadores exigentes.',
    },
    {
      id: 2,
      name: 'Balón Fut-sala',
      image:
        'https://res.cloudinary.com/dbxvkqv6w/image/upload/v1751595002/balon_futbol_sala_6264_a1rjmk.png',
      price: '$80.000',
      category: 'Balones',
      subcategory: 'Fut-sala',
      ageGroup: 'adulto',
      description: 'Balón oficial para futsal con excelente control.',
    },
    {
      id: 3,
      name: 'Licra Deportiva',
      image:
        'https://i.pinimg.com/736x/d3/63/a9/d363a99dc7fff34f022672c21accfc24.jpg',
      price: '$45.000',
      category: 'Licras',
      subcategory: 'Camisetas',
      ageGroup: 'adulto',
      description: 'Licra deportiva transpirable y cómoda.',
    },
    {
      id: 4,
      name: 'Guayo Amateur',
      image:
        'https://res.cloudinary.com/dbxvkqv6w/image/upload/v1751595994/BT_EEE_ggqxhk.png',
      price: '$95.000',
      category: 'Guayos',
      subcategory: 'Amateur',
      ageGroup: 'adulto',
      description: 'Guayo ideal para jugadores amateur y entrenamientos.',
    },
    {
      id: 5,
      name: 'Guayo Niños',
      image:
        'https://i.pinimg.com/736x/f7/61/92/f7619205c0d6b5370d6b2aa94c378892.jpg',
      price: '$70.000',
      category: 'Guayos',
      subcategory: 'Niños',
      ageGroup: 'niño',
      description: 'Guayo especialmente diseñado para niños.',
    },
    {
      id: 6,
      name: 'Balón Training',
      image:
        'https://res.cloudinary.com/dbxvkqv6w/image/upload/v1751594986/balon__5_ncjfqk.png',
      price: '$90.000',
      category: 'Balones',
      subcategory: 'Training',
      ageGroup: 'adulto',
      description: 'Balón resistente para entrenamientos intensivos.',
    },
    {
      id: 7,
      name: 'Camiseta Fiera',
      image:
        'https://i.pinimg.com/736x/e6/ae/0f/e6ae0f1f5813564e01b32af9c2c64a05.jpg',
      price: '$65.000',
      category: 'Licras',
      subcategory: 'Camisetas',
      ageGroup: 'adulto',
      description: 'Camiseta oficial de la marca Fiera.',
    },
    {
      id: 8,
      name: 'Balón Micro',
      image:
        'https://res.cloudinary.com/dbxvkqv6w/image/upload/v1751595128/balon_de_micro_3.5_wcpmxj.png',
      price: '$60.000',
      category: 'Balones',
      subcategory: 'Micro',
      ageGroup: 'niño',
      description: 'Balón tamaño micro ideal para niños pequeños.',
    },
    {
      id: 9,
      name: 'Profesional Sintetico',
      image:
        'https://res.cloudinary.com/dijh9two4/image/upload/v1751595776/guayo_pf_sintetico_002_nf_ep7fxa.png',
      price: '$160.000',
      category: 'Guayos',
      subcategory: 'Profesionales',
      ageGroup: 'adulto',
      description:
        'Guayo profesional sintético para mayor agarre en la cancha.',
    },
    {
      id: 10,
      name: 'Profesional Cuero',
      image:
        'https://res.cloudinary.com/dijh9two4/image/upload/v1751595776/guayo_pf_DI_nf_eogoha.png',
      price: '$140.000',
      category: 'Guayos',
      subcategory: 'Profesionales',
      ageGroup: 'adulto',
      description: 'Guayo profesional de cuero para mayor comodidad.',
    },
    {
      id: 11,
      name: 'Profesional Negro',
      image:
        'https://res.cloudinary.com/dijh9two4/image/upload/v1751595775/guayo_pf_nf_ee4hzt.png',
      price: '$140.000',
      category: 'Guayos',
      subcategory: 'Profesionales',
      ageGroup: 'adulto',
      description: 'Guayo profesional negro para mayor estilo.',
    },
    {
      id: 12,
      num_referencia: 'G01',
      category: 'Guayos',
      subcategory: 'Amateur',
      name: 'Guayo Futbol-sala',
      type: 'ZFS',
      size: '38-44',
      color: 'NAM',
      image:
        'https://res.cloudinary.com/dijh9two4/image/upload/v1751595775/guayo_pf_nf_ee4hzt.png',
      description: 'Guayo fut sala de cuero de culebra para mejores fintas',
    },
    {
      id: 13,
      num_referencia: 'B02',
      category: 'Balones',
      subcategory: 'Futbol',
      name: 'Balón Futbol',
      type: 'Futbol 11',
      size: '#5',
      color: 'Blanco',
      image:
        'https://res.cloudinary.com/dbxvkqv6w/image/upload/v1751595128/balon_de_micro_3.5_wcpmxj.png',
      description: 'Balón de futbol 11, tamaño #5, color blanco.',
    },
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