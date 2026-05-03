import { Routes, Route } from 'react-router-dom';
import { PUBLIC_ROUTES, PRIVATE_ROUTES } from './routes';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Páginas públicas
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

// Páginas privadas
import Dashboard from '../pages/Dashboard';

// Define todas las rutas de la app. Las publicas las puede ver cualquiera;
// las privadas solo se muestran si el usuario tiene sesion activa.
const AppRouter = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Estas rutas no requieren estar logueado. */}
      <Route path={PUBLIC_ROUTES.HOME} element={<Home />} />
      <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />
      <Route path={PUBLIC_ROUTES.REGISTER} element={<Register />} />
      <Route path={PUBLIC_ROUTES.ABOUT} element={<About />} />

      {/* Estas rutas solo se muestran si el usuario tiene sesion activa. Si no, lo mandamos al login. */}
      <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
        <Route path={PRIVATE_ROUTES.DASHBOARD} element={<Dashboard />} />
        {/* Agregar mas rutas privadas aqui */}
      </Route>

      {/* Ejemplo de ruta protegida ademas por rol (solo ADMIN).
           Descomentar cuando exista la pantalla correspondiente.
      <Route element={<ProtectedRoute isAllowed={isAuthenticated} allowedRoles={['ADMIN']} userRole={user?.rol} />}>
        ...rutas de administracion...
      </Route>
      */}
      {void user}

      {/* Cualquier direccion que no coincida con las anteriores muestra la pagina 404. */}
      <Route path={PUBLIC_ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
