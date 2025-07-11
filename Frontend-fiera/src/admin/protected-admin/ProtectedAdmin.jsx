import { useState, useEffect } from 'react';
import FormAdmin from '../form-admin/FormAdmin';
import './ProtectedAdmin.css';

const ProtectedAdmin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para manejar la autenticación
    const [password, setPassword] = useState(''); // Estado para manejar la contraseña ingresada
    const [error, setError] = useState(''); // Estado para manejar errores de autenticación
    const [attempts, setAttempts] = useState(0); // Estado para manejar los intentos de inicio de sesión

    const SECRET_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD; // Contraseña secreta para autenticación

    const handleSubmit = e => {
        e.preventDefault();
        if (password === SECRET_PASSWORD) {
            setIsAuthenticated(true);
            setError('');

            sessionStorage.setItem('fiera_admin_authenticated', 'true'); // Guardar estado de autenticación en sessionStorage hasta que se cierre la pestaña
        } else {
            setAttempts(prev => prev + 1);
            if (attempts >= 4) {
                setError('Demasiados intentos. Intente más tarde.');
                setTimeout(() => setAttempts(0), 30000); // Bloquear por 30 segundos
            } else {
                setError(`Contraseña incorrecta (${5 - attempts} intentos restantes)`);
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('fiera_admin_authenticated');
        setIsAuthenticated(false);
    };

    useState(() => {
        // si ya esta autenticado no pide la contraseña al refrescar la pagina
        const isAuth =
            sessionStorage.getItem('fiera_admin_authenticated') === 'true';
        if (isAuth) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            // Cierra sesión después de 30 minutos de inactividad
            const inactivityTimeout = setTimeout(() => {
                handleLogout();
            }, 5 * 60 * 1000);

            // Reinicia el temporizador en cada actividad del usuario
            const resetTimer = () => {
                clearTimeout(inactivityTimeout);
                setTimeout(() => {
                    handleLogout();
                }, 5 * 60 * 1000);
            };

            // Eventos que reinician el temporizador
            window.addEventListener('mousemove', resetTimer);
            window.addEventListener('keypress', resetTimer);

            return () => {
                clearTimeout(inactivityTimeout);
                window.removeEventListener('mousemove', resetTimer);
                window.removeEventListener('keypress', resetTimer);
            };
        }
    }, [isAuthenticated]);

    // Si esta autenticado, muestra el formulario de administración
    if (isAuthenticated) {
        return <FormAdmin onLogout={handleLogout} />;
    }

    // Si no está autenticado, muestra el formulario de ingreso de contraseña
    return (
        <div className="admin-auth-container">
            <img src="/logo_fiera.png" alt="Logo Fiera" className="admin-auth-logo" />
            <h2> Area de Administración</h2>
            <form onSubmit={handleSubmit} className="admin-auth-form">
                <div className="form-group">
                    <label htmlFor="password">Contraseña de Administrador</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Ingrese la contraseña"
                        autoComplete="current-password"
                    />
                    {error && <span className="error-message">{error}</span>}
                </div>
                <button type="submit" className="submit-button">
                    Ingresar
                </button>
            </form>
        </div>
    );
};
export default ProtectedAdmin;
