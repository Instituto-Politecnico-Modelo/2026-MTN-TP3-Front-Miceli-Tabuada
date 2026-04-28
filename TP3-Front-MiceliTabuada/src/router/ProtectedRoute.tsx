import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  /** Condición que determina si el usuario tiene acceso */
  isAllowed: boolean;
  /** Ruta a la que redirigir si no tiene acceso (por defecto: /login) */
  redirectTo?: string;
}

/**
 * Envuelve rutas que requieren autenticación.
 * Si `isAllowed` es false, redirige a `redirectTo`.
 * Usar con <Outlet /> para rutas anidadas.
 */
const ProtectedRoute = ({ isAllowed, redirectTo = '/login' }: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
