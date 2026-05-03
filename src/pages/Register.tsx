import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authService } from '../services/auth';
import './Register.css';

// Pantalla de registro. Reune todos los datos que el backend necesita para crear un usuario nuevo.
const Register = () => {
  const navigate = useNavigate();

  // Lo que el usuario va completando en cada campo del formulario.
  const [form, setForm] = useState({ dni: '', nombre: '', apellido: '', email: '', password: '', confirm: '' });

  // Mensajes de error que aparecen debajo de cada campo cuando algo falta o esta mal.
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  // Si el servidor devuelve un error (por ejemplo, el email ya existe), lo mostramos aca.
  const [apiError, setApiError] = useState('');

  // Mientras esperamos respuesta del servidor, bloqueamos el boton para evitar envios duplicados.
  const [loading, setLoading] = useState(false);

  // Revisa que todos los campos esten completos y que las contrasenas coincidan antes de mandar nada al servidor.
  const validate = () => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {};
    if (!form.dni) newErrors.dni = 'El DNI es requerido';
    else if (isNaN(Number(form.dni))) newErrors.dni = 'El DNI debe ser numerico';
    if (!form.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!form.apellido) newErrors.apellido = 'El apellido es requerido';
    if (!form.email) newErrors.email = 'El email es requerido';
    if (!form.password) newErrors.password = 'La contrasena es requerida';
    if (form.password !== form.confirm) newErrors.confirm = 'Las contrasenas no coinciden';
    return newErrors;
  };

  // Cuando el usuario apreta Registrarse: primero valida los campos, despues llama al servidor.
  // Si el registro sale bien, manda al usuario a la pantalla de login para que inicie sesion.
  // Si el servidor devuelve un error (email o DNI ya registrado), se lo mostramos.
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
      await authService.register({
        dni: Number(form.dni),
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
      });
      navigate('/login');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <Card title="Crear Cuenta" className="register__card">
        <form onSubmit={handleSubmit} className="register__form" noValidate>
          <Input
            id="dni"
            label="DNI"
            type="text"
            placeholder="12345678"
            value={form.dni}
            error={errors.dni}
            onChange={(e) => setForm({ ...form, dni: e.target.value })}
          />
          <Input
            id="nombre"
            label="Nombre"
            type="text"
            placeholder="Juan"
            value={form.nombre}
            error={errors.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <Input
            id="apellido"
            label="Apellido"
            type="text"
            placeholder="Pérez"
            value={form.apellido}
            error={errors.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          />
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
          <Input
            id="confirm"
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            value={form.confirm}
            error={errors.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          {/* Muestra el error que mando el servidor solo cuando hay uno, por ejemplo email ya registrado. */}
          {apiError && <p className="form__api-error">{apiError}</p>}
          {/* El boton se deshabilita mientras esperamos respuesta para que el usuario no lo aprete dos veces. */}
          <Button type="submit" size="lg" className="register__submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>
        <p className="register__login">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login">Iniciá sesión</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
