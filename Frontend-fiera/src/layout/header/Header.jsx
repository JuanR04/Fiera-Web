import "./Header.css";
import { CiSearch } from "react-icons/ci";
import { IoIosMenu } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="nav__bar">
            <div className="logo__container">
                <img src="./logo_fiera.png" alt="logo" />
            </div>

            <div className="search__bar">
                <CiSearch />
                <input type="text" placeholder="Buscar..." />
            </div>

            <button className="menu_button" onClick={toggleMenu}>
                <IoIosMenu style={{ fontSize: "34px", cursor: "pointer" }} />
            </button>

            <nav className="nav_list">
                <ul className="__list">
                    <li className="list__item"><NavLink className={"item"} to="/ofertas">Ofertas</NavLink></li>
                    <li className="list__item"><NavLink className={"item"} to="/catalogo">Catálogo</NavLink></li>
                    <li className="list__item"><NavLink className={"item"} to="/novedades">Novedades</NavLink></li>
                </ul>
            </nav>

            {/* Menú móvil tipo slider full screen */}
            <div className={`mobile__menu ${menuOpen ? "show" : ""}`}>
                <button className="close_button" onClick={closeMenu}>
                    <AiOutlineClose size={28} />
                </button>
                <ul>
                    <li><NavLink to="/novedades" onClick={closeMenu}>Novedades</NavLink></li>
                    <li><NavLink to="/catalogo" onClick={closeMenu}>Catálogo</NavLink></li>
                    <li><NavLink to="/ofertas" onClick={closeMenu}>Ofertas</NavLink></li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
