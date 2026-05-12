import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AppRouter from './router/AppRouter';

function App() {
  return (
    //auth privider maneja autenticacion globalmente.
    <AuthProvider>
      //BrowserRouter maneja las rutas de la aplicacion.
      <BrowserRouter>
        // layout agarra toda la aplicacion y le da un diseño consistente. todas las paginas estan dentro de layout.
        <Layout>
          // app router, segun la ruta, muestra un componente diferente. es el encargado de mostrar las paginas de la aplicacion.
          <AppRouter />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
