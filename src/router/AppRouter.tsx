import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { lazy, Suspense } from 'react';

import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

// Lazy-loaded pages
const Grilla = lazy(() => import('../pages/Grilla'));
const ClienteDashboard = lazy(() => import('../pages/cliente/Dashboard'));
const NuevaReserva = lazy(() => import('../pages/cliente/NuevaReserva'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const CanchasABM = lazy(() => import('../pages/admin/CanchasABM'));
const TurnosABM = lazy(() => import('../pages/admin/TurnosABM'));
const UsuariosPanel = lazy(() => import('../pages/admin/UsuariosPanel'));

const AppRouter = () => {
  const { isAuthenticated, rol } = useAuth();

  const homeRedirect = isAuthenticated
    ? rol === 'ADMINISTRADOR'
      ? '/admin/dashboard'
      : '/cliente/dashboard'
    : '/login';

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to={homeRedirect} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/grilla" element={<Grilla />} />

        {/* Protected — CLIENTE */}
        <Route element={<ProtectedRoute requiredRole="CLIENTE" />}>
          <Route path="/cliente/dashboard" element={<ClienteDashboard />} />
          <Route path="/cliente/nueva-reserva" element={<NuevaReserva />} />
        </Route>

        {/* Protected — ADMINISTRADOR */}
        <Route element={<ProtectedRoute requiredRole="ADMINISTRADOR" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/canchas" element={<CanchasABM />} />
          <Route path="/admin/turnos" element={<TurnosABM />} />
          <Route path="/admin/usuarios" element={<UsuariosPanel />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

