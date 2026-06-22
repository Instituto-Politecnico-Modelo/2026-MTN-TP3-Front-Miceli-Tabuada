import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Home.css';

const Home = () => {
  const { isAuthenticated, usuario } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <span className="home__badge">⚽ Fútbol 5 Ya</span>
        <h1 className="home__title">
          {isAuthenticated
            ? `¡Bienvenido, ${usuario?.nombre}!`
            : 'Organizá tu fútbol 5 fácilmente'}
        </h1>
        <p className="home__subtitle">
          Gestioná partidos, jugadores y canchas desde un solo lugar.
        </p>
        {!isAuthenticated && (
          <div className="home__hero-actions">
            <Link to="/register">
              <Button size="lg">Crear cuenta gratis</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">Iniciar sesión</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Cards de features */}
      <section className="home__cards">
        <Card title="👥 Usuarios">
          <p>Registrate como jugador o administrador y gestioná tu perfil completo.</p>
        </Card>
        <Card title="🔒 Seguro">
          <p>Autenticación con <strong>JWT</strong>. Tus datos están protegidos.</p>
        </Card>
        <Card title="⚡ Rápido">
          <p>Backend en <strong>Spring Boot</strong> y frontend en <strong>React + Vite</strong>.</p>
        </Card>
      </section>
    </div>
  );
};

export default Home;
