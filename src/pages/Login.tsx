import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.email) newErrors.email = 'El email es requerido';
    if (!form.password) newErrors.password = 'La contraseña es requerida';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // TODO: llamar al servicio de autenticación
    navigate('/');
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
          <Button type="submit" size="lg" className="login__submit">
            Ingresar
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
