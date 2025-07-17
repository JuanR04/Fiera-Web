import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    type: '',
    ageGroup: '',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/getproduct`)
      .then(res => res.json())
      .then(data => {
        const productsArray = Array.isArray(data) ? data : [];
        setProduct(productsArray);
        setTotalProducts(productsArray.length);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    setProducts(filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct));
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
  }, [filteredProducts, currentPage, productsPerPage]);

  const searchProducts = query => {
    if (!query || !query.trim()) return product;

    const searchTerms = query.toLowerCase().trim().split(/\s+/);

    return product.filter(item => {
      const searchableText = [
        item.name || '',
        item.description || '',
        item.category || '',
        item.subcategory || '',
        item.type || '',
        item.material || '',
        item.num_referencia || '',
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  };

  const applySearch = query => {
    if (!query.trim()) {
      setSearchTerm('');
      fetchProducts(filters);
      return;
    }

    saveRecentSearch(query);

    setSearchTerm(query);
    setLoading(true);
    const results = searchProducts(query);
    setFilteredProducts(results);
    setCurrentPage(1);
    setLoading(false);

    setFilters({ category: '', subcategory: '', ageGroup: '' });
    setSearchParams({ q: query });
  };

  const changePage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  const saveRecentSearch = query => {
    if (!query.trim()) return;

    try {
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error guardando búsqueda reciente:', error);
    }
  };

  const getRecentSearches = () => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch (error) {
      console.error('Error al obtener búsquedas recientes:', error);
      return [];
    }
  };

  const fetchProducts = async (currentFilters = filters) => {
    setLoading(true);
    try {
      if (searchTerm) {
        setSearchTerm('');
        setSearchParams(
          Object.fromEntries(Object.entries(currentFilters).filter(([_, v]) => v))
        );
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      let results = [...product];

      if (currentFilters.category) {
        results = results.filter(p => p.category === currentFilters.category);
      }
      if (currentFilters.subcategory) {
        results = results.filter(p => p.subcategory === currentFilters.subcategory);
      }
      if (currentFilters.type) {
        results = results.filter(p => p.type === currentFilters.type);
      }
      if (currentFilters.ageGroup) {
        results = results.filter(p => p.ageGroup === currentFilters.ageGroup);
      }

      setFilteredProducts(results);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product.length === 0) return;

    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const type = searchParams.get('type') || '';
    const ageGroup = searchParams.get('ageGroup') || '';

    const urlFilters = { category, subcategory, type, ageGroup };

    setCurrentPage(page);

    if (query) {
      setSearchTerm(query);
      const results = searchProducts(query);
      setFilteredProducts(results);
    } else {
      setFilters(urlFilters);
      fetchProducts(urlFilters);
    }
  }, [product, searchParams]);


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

  const setItemsPerPage = (amount) => {
    setProductsPerPage(amount);
    setCurrentPage(1);
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        loading,
        filters,
        searchTerm,
        currentPage,
        totalPages,
        productsPerPage,
        totalProducts: filteredProducts.length,
        applyFilter,
        clearFilters,
        applySearch,
        getRecentSearches,
        changePage,
        nextPage,
        prevPage,
        setItemsPerPage
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};
