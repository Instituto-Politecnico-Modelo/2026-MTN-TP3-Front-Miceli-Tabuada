import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__message">Página no encontrada</p>
      <Link to="/" className="not-found__link">Volver al inicio</Link>
    </div>
  );
};

export default NotFound;
