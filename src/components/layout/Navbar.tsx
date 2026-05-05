import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">MiApp</Link>
      </div>
      <ul className="navbar__links">
        <li><NavLink to="/">Inicio</NavLink></li>
        <li><NavLink to="/about">Acerca de</NavLink></li>
        {isAuthenticated ? (
          <>
            <li><NavLink to="/perfil">{user?.nombre || 'Perfil'}</NavLink></li>
            <li><button className="navbar__logout" onClick={handleLogout}>Cerrar sesión</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login">Ingresar</NavLink></li>
            <li><NavLink to="/register">Registrarse</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
