import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">MiApp</Link>
      </div>
      <ul className="navbar__links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/about">Acerca de</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
