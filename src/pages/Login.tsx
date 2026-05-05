import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authService } from '../services/auth';
import { userService } from '../services/user';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.email) newErrors.email = 'El email es requerido';
    if (!form.password) newErrors.password = 'La contrasena es requerida';
    return newErrors;
  };

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
      // Guarda el token y decodifica los datos básicos del JWT
      login(response.token);
      // Busca el usuario completo (con ID) por email para poder editar el perfil
      const usuarioCompleto = await userService.findByEmail(form.email);
      if (usuarioCompleto) updateUser(usuarioCompleto);
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
