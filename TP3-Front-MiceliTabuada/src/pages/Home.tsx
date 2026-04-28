import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1 className="home__title">Bienvenido a MiApp</h1>
      <p className="home__subtitle">Proyecto TP3 — Miceli &amp; Tabuada</p>
      <div className="home__cards">
        <Card title="Componentes Base">
          <p>Este proyecto incluye componentes reutilizables como <strong>Button</strong>, <strong>Input</strong> y <strong>Card</strong>.</p>
          <Button style={{ marginTop: '1rem' }}>Ver más</Button>
        </Card>
        <Card title="Estructura del Proyecto">
          <p>El proyecto está organizado en <strong>pages</strong>, <strong>components</strong>, <strong>hooks</strong>, <strong>services</strong>, <strong>types</strong> y <strong>context</strong>.</p>
          <Button variant="secondary" style={{ marginTop: '1rem' }}>Explorar</Button>
        </Card>
      </div>
    </div>
  );
};

export default Home;
