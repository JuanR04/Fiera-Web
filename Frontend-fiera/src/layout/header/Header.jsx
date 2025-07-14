import './Header.css';
import { CiSearch } from 'react-icons/ci';
import { IoIosMenu } from 'react-icons/io';
import { AiOutlineClose } from 'react-icons/ai';
import { FaHistory, FaFire } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCatalog } from '../../context/CatalogContext';

const Header = () => {
  const navigate = useNavigate();
  const { applySearch, getRecentSearches } = useCatalog();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchContainerRef = useRef(null);

  // Búsquedas populares predefinidas
  const popularSearches = [
    'guayos profesional',
    'guayos amateur',
    'balones futsal',
    'licras deportivas',
    
  ];

  useEffect(() => {
    // Cargar búsquedas recientes
    setRecentSearches(getRecentSearches());

    // Cerrar sugerencias al hacer clic fuera
    const handleClickOutside = event => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [getRecentSearches]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchChange = e => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = e => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    applySearch(searchInput);
    navigate('/catalogo');
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = term => {
    setSearchInput(term);
    applySearch(term);
    navigate('/catalogo');
    setShowSuggestions(false);
  };

  return (
    <div className="nav__bar">
      <div className="logo__container">
        <NavLink to="/">
          <img src="./logo_fiera.png" alt="logo" />
        </NavLink>
      </div>

      {/* Mantener la estructura original de search__bar */}
      <div className="search__bar" ref={searchContainerRef}>
        <CiSearch onClick={handleSearchSubmit} style={{ cursor: 'pointer' }} />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchInput}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
        />

        {/* Sugerencias como elemento hijo de search__bar */}
        {showSuggestions && (
          <div className="search-suggestions">
            {searchInput && (
              <div className="suggestion-group">
                <span className="suggestion-title">Buscar:</span>
                <div
                  className="suggestion-item search-now"
                  onClick={handleSearchSubmit}
                >
                  <CiSearch style={{ marginRight: '8px' }} />"{searchInput}"
                </div>
              </div>
            )}

            {recentSearches.length > 0 && (
              <div className="suggestion-group">
                <span className="suggestion-title">
                  <FaHistory style={{ marginRight: '8px', fontSize: '12px' }} />
                  Búsquedas recientes:
                </span>
                {recentSearches.map((term, i) => (
                  <div
                    key={i}
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(term)}
                  >
                    {term}
                  </div>
                ))}
              </div>
            )}

            <div className="suggestion-group">
              <span className="suggestion-title">
                <FaFire style={{ marginRight: '8px', fontSize: '12px' }} />
                Búsquedas populares:
              </span>
              {popularSearches.map((term, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(term)}
                >
                  {term}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="menu_button" onClick={toggleMenu}>
        <IoIosMenu style={{ fontSize: '34px', cursor: 'pointer' }} />
      </button>

      <nav className="nav_list">
        <ul className="__list">
          <li className="list__item">
            <NavLink className={'item'} to="/ofertas">
              Ofertas
            </NavLink>
          </li>
          <li className="list__item">
            <NavLink className={'item'} to="/catalogo">
              Catálogo
            </NavLink>
          </li>
          <li className="list__item">
            <NavLink className={'item'} to="/novedades">
              Novedades
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Menú móvil tipo slider full screen */}
      <div className={`mobile__menu ${menuOpen ? 'show' : ''}`}>
        <button className="close_button" onClick={closeMenu}>
          <AiOutlineClose size={28} />
        </button>
        <ul>
          <li>
            <NavLink to="/novedades" onClick={closeMenu}>
              Novedades
            </NavLink>
          </li>
          <li>
            <NavLink to="/catalogo" onClick={closeMenu}>
              Catálogo
            </NavLink>
          </li>
          <li>
            <NavLink to="/ofertas" onClick={closeMenu}>
              Ofertas
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
