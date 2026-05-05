import { Routes, Route } from 'react-router-dom';
import { PUBLIC_ROUTES, PRIVATE_ROUTES } from './routes';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path={PUBLIC_ROUTES.HOME} element={<Home />} />
      <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />
      <Route path={PUBLIC_ROUTES.REGISTER} element={<Register />} />
      <Route path={PUBLIC_ROUTES.ABOUT} element={<About />} />

      <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
        <Route path={PRIVATE_ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={PRIVATE_ROUTES.PROFILE} element={<Profile />} />
      </Route>

      <Route path={PUBLIC_ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
