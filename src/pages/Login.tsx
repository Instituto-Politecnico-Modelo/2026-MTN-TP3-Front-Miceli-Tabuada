import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authService } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import './Login.css';

// Pantalla de inicio de sesion. El usuario ingresa su email y contrasena para entrar a la app.
const Login = () => {
  const navigate = useNavigate();
  // Necesitamos la funcion login del contexto para actualizar la sesion en toda la app despues de autenticar.
  const { login } = useAuth();

  // Lo que el usuario va escribiendo en los campos del formulario.
  const [form, setForm] = useState({ email: '', password: '' });

  // Mensajes que aparecen debajo de cada campo cuando algo esta vacio o mal.
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Si el servidor rechaza el login, guardamos el mensaje aca para mostrarselo al usuario.
  const [apiError, setApiError] = useState('');

  // Mientras esperamos respuesta del servidor, bloqueamos el boton para evitar envios dobles.
  const [loading, setLoading] = useState(false);

  // Chequeos basicos antes de llamar al servidor. Si los campos estan vacios no tiene sentido mandar nada.
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.email) newErrors.email = 'El email es requerido';
    if (!form.password) newErrors.password = 'La contrasena es requerida';
    return newErrors;
  };

  // Cuando el usuario apreta Ingresar: primero valida los campos, despues llama al servidor,
  // y si todo sale bien actualiza la sesion global y manda al usuario al inicio.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      const response = await authService.login({ email: form.email, password: form.password });
      // Le pasamos el token al contexto para que lo guarde y actualice el estado de sesion.
      login(response.token);
      navigate('/');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <Card title="Iniciar Sesión" className="login__card">
        <form onSubmit={handleSubmit} className="login__form" noValidate>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {/* Muestra el error que mando el servidor solo cuando hay uno, por ejemplo "Credenciales invalidas". */}
          {apiError && <p className="form__api-error">{apiError}</p>}
          {/* El boton se deshabilita mientras esperamos respuesta para que el usuario no lo aprete dos veces. */}
          <Button type="submit" size="lg" className="login__submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
        <p className="login__register">
          ¿No tenés cuenta?{' '}
          <Link to="/register">Registrate</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
