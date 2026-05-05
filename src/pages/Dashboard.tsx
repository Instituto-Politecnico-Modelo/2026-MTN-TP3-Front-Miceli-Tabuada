import Card from '../components/ui/Card';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>
      <div className="dashboard__grid">
        <Card title="Bienvenido">
          <p>Estás en el área privada de la aplicación.</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
