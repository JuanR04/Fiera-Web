import { useState, useEffect } from 'react';
import DashboardAdmin from '../dashboard_admin';
import './ProtectedAdmin.css';

const ProtectedAdmin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [lockoutTime, setLockoutTime] = useState(0);

    const SECRET_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

    const handleSubmit = e => {
        e.preventDefault();

        if (lockoutTime > 0) return; // Evita intentar mientras está bloqueado

        if (password === SECRET_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
            sessionStorage.setItem('fiera_admin_authenticated', 'true');
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= 5) {
                setError('Demasiados intentos. Intente de nuevo en 30 segundos.');
                setLockoutTime(30);
            } else {
                setError(`Contraseña incorrecta (${5 - newAttempts} intentos restantes)`);
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('fiera_admin_authenticated');
        setIsAuthenticated(false);
        setPassword('');
    };

    // Verificar si ya estaba autenticado al cargar
    useEffect(() => {
        const isAuth = sessionStorage.getItem('fiera_admin_authenticated') === 'true';
        if (isAuth) setIsAuthenticated(true);
    }, []);

    // Temporizador de bloqueo por intentos fallidos
    useEffect(() => {
        if (lockoutTime > 0) {
            const timer = setInterval(() => {
                setLockoutTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setAttempts(0);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [lockoutTime]);

    // Inactividad: cerrar sesión después de 30 minutos sin interacción
    useEffect(() => {
        if (!isAuthenticated) return;

        let inactivityTimeout;

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                handleLogout();
            }, 30 * 60 * 1000); // 30 minutos
        };

        // Inicializa temporizador y escucha eventos
        resetInactivityTimer();
        window.addEventListener('mousemove', resetInactivityTimer);
        window.addEventListener('keypress', resetInactivityTimer);

        return () => {
            clearTimeout(inactivityTimeout);
            window.removeEventListener('mousemove', resetInactivityTimer);
            window.removeEventListener('keypress', resetInactivityTimer);
        };
    }, [isAuthenticated]);

    // Vista si está autenticado
    if (isAuthenticated) {
        return <DashboardAdmin onLogout={handleLogout} />;
    }

    // Vista de login
    return (
        <div className="admin-auth-container">
            <img src="/logo_fiera.png" alt="Logo Fiera" className="admin-auth-logo" />
            <h2>Área de Administración</h2>

            <form onSubmit={handleSubmit} className="admin-auth-form">
                <div className="form-group_l">
                    <label htmlFor="password">Contraseña de Administrador</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Ingrese la contraseña"
                        autoComplete="current-password"
                        disabled={lockoutTime > 0}
                    />
                    {error && <span className="error-message">{error}</span>}
                </div>

                <button type="submit" className="submit-button" disabled={lockoutTime > 0}>
                    Ingresar
                </button>

                {lockoutTime > 0 && (
                    <div className="lockout-timer">
                        Puedes intentar nuevamente en <strong>{lockoutTime}</strong> segundos.
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProtectedAdmin;
