import Card from '../components/ui/Card';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <h1 className="about__title">Acerca del Proyecto</h1>
      <Card>
        <p>
          Este proyecto fue desarrollado como parte del <strong>TP3</strong> de la materia.
          Utiliza <strong>React</strong> con <strong>TypeScript</strong> y <strong>Vite</strong> como bundler.
        </p>
        <ul className="about__list">
          <li>⚛️ React 19</li>
          <li>🔷 TypeScript</li>
          <li>⚡ Vite</li>
          <li>🔀 React Router DOM</li>
        </ul>
        <p className="about__authors">
          <strong>Autores:</strong> Miceli &amp; Tabuada
        </p>
      </Card>
    </div>
  );
};

export default About;
