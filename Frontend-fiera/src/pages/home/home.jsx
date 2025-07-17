import Carousel from "../../components/corousel/mobile/Carousel";
import CarouselD from "../../components/corousel/desktop/Carousel";
import { useState, useEffect } from "react";
import "./home.css";
import { NavLink } from "react-router-dom";

const Home = () => {
    // Hook para detectar si es móvil
    const useIsMobile = (breakpoint = 768) => {
        const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

        useEffect(() => {
            const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, [breakpoint]);

        return isMobile;
    };

    const isMobile = useIsMobile();

    const DesktopPresentation = () => (
        <div className="desktop-presentation">
            {/* Aquí tu presentación para desktop */}
            <CarouselD />
        </div>
    );

    return (
        <>
            <div className="main_container">
                <div className="__presentation_container">
                    <picture className="imagen__presentacion">
                        <source srcset="/images/plata_movil.png" media="(max-width: 768px)" />
                        <source srcset="/images/plata_desk.png" media="(min-width: 769px)" />
                        <img src="/images/plata_desk.jpg" alt="Imagen de plata" />
                    </picture>

                    <h2>Explora, conoce, Deja huella.</h2>
                </div>
                <div className="title_info">
                    <h2>Siente la Calidad</h2>
                    <h3> A un bajo costo</h3>
                </div>
                <div className="container __view_balls">
                    <img src="/images/balon_futbol_sala.png" alt="" />
                    <h2>Sé un ganador</h2>
                    <h3>Conquista la cancha con clase y potencia</h3>
                    <NavLink className={"btn_"} to="/catalogo?category=Balones">Ver balones</NavLink>
                </div>
                <div className="container __view_boots">

                </div>
                <div className="container __publicite_container">
                    {isMobile ? <Carousel /> : <DesktopPresentation />}
                </div>
                <div className="container __mayorista_container">
                    <div className="mayorista_content">
                        <div className="mayorista_text">
                            <h2>Guayos al por mayor</h2>
                            <h3>Directo de fábrica</h3>
                            <p>
                                Somos fabricantes de guayos y ofrecemos venta exclusiva al por mayor para tiendas deportivas y distribuidores.
                                ¡Calidad profesional a precios directos de fábrica!
                            </p>
                            <NavLink className="btn_" to="/catalogo?category=Guayos">
                                Ver catálogo
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;