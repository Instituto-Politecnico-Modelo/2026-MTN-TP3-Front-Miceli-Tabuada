import { Routes, Route } from 'react-router-dom';
import { PUBLIC_ROUTES, PRIVATE_ROUTES } from './routes';
import ProtectedRoute from './ProtectedRoute';

// Páginas públicas
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

// Páginas privadas
import Dashboard from '../pages/Dashboard';

// TODO: reemplazar con el valor real del contexto de auth
const isAuthenticated = false;

const AppRouter = () => {
  return (
    <Routes>
      {/* ── Rutas públicas ── */}
      <Route path={PUBLIC_ROUTES.HOME} element={<Home />} />
      <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />
      <Route path={PUBLIC_ROUTES.REGISTER} element={<Register />} />
      <Route path={PUBLIC_ROUTES.ABOUT} element={<About />} />

      {/* ── Rutas privadas ── */}
      <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
        <Route path={PRIVATE_ROUTES.DASHBOARD} element={<Dashboard />} />
        {/* Agregar más rutas privadas aquí */}
      </Route>

      {/* ── 404 ── */}
      <Route path={PUBLIC_ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
