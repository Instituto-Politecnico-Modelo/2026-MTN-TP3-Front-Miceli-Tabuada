import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
  userRole?: string;
}

// Bloquea el acceso a rutas privadas. Si el usuario no está autenticado lo redirige al login.
// Opcionalmente verifica que el usuario tenga uno de los roles requeridos.
const ProtectedRoute = ({ isAllowed, redirectTo = '/login', allowedRoles, userRole }: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  if (allowedRoles && allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
