import { Link } from 'react-router-dom';

const AdminDashboard = () => (
  <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
    <h1>Panel de Administración</h1>
    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Bienvenido al panel de administración de FútYa.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <Link to="/admin/canchas" style={cardStyle}>
        <span style={{ fontSize: '2rem' }}>⚽</span>
        <strong>Canchas</strong>
        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Gestionar canchas</span>
      </Link>
      <Link to="/admin/turnos" style={cardStyle}>
        <span style={{ fontSize: '2rem' }}>🕐</span>
        <strong>Turnos</strong>
        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Gestionar turnos</span>
      </Link>
      <Link to="/admin/usuarios" style={cardStyle}>
        <span style={{ fontSize: '2rem' }}>👥</span>
        <strong>Usuarios</strong>
        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Ver usuarios y reservas</span>
      </Link>
    </div>
  </div>
);

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '1.5rem',
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  textDecoration: 'none',
  color: '#111827',
  transition: 'box-shadow 0.2s',
};

export default AdminDashboard;
