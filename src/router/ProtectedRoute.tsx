import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  // Si es falso el usuario no puede entrar, lo mandamos a la ruta de redireccion.
  isAllowed: boolean;
  // A donde mandarlo si no tiene acceso. Por defecto va al login.
  redirectTo?: string;
  // Si se especifican roles, el usuario tambien tiene que tener uno de ellos para entrar.
  allowedRoles?: string[];
  // El rol que tiene el usuario logueado actualmente.
  userRole?: string;
}

// Actua como portero antes de mostrar una ruta privada.
// Primero verifica que el usuario este logueado; si ademas se piden roles, verifica que tenga el permiso correcto.
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
