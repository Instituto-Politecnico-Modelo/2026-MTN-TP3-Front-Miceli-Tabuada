import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, usuario, rol, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    void logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">FútYa</Link>
      </div>
      <ul className="navbar__links">
        <li><NavLink to="/">Inicio</NavLink></li>
        {isAuthenticated && <li><NavLink to="/grilla">Grilla</NavLink></li>}
        {isAuthenticated && rol === 'CLIENTE' && (
          <li><NavLink to="/cliente/dashboard">Mi Panel</NavLink></li>
        )}
        {isAuthenticated && rol === 'ADMINISTRADOR' && (
          <li><NavLink to="/admin/dashboard">Admin</NavLink></li>
        )}
        {isAuthenticated ? (
          <>
            <li><NavLink to="/perfil">{usuario?.nombre ?? 'Perfil'}</NavLink></li>
            <li><button className="navbar__logout" onClick={handleLogout}>Cerrar sesión</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login">Ingresar</NavLink></li>
            <li><NavLink to="/registro">Registrarse</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

