import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
  userRole?: string;
}

//protected route es un componente que se fija que el usuario este autenticado para dejarle ver rutas privadas.
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
