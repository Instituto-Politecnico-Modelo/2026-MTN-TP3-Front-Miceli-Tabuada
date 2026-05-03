import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AppRouter from './router/AppRouter';

function App() {
  return (
    // [Issue 25] AuthProvider envuelve toda la app para que cualquier componente
    // pueda acceder al estado de sesión y roles mediante useAuth().
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <AppRouter />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
