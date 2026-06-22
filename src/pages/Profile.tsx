import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { usuario } = useAuth();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    password: '',
    confirm: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setForm((prev) => ({
        ...prev,
        nombre: usuario.nombre ?? '',
        apellido: usuario.apellido ?? '',
        telefono: usuario.telefono ?? '',
      }));
    }
  }, [usuario]);

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {};
    if (!form.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!form.apellido) newErrors.apellido = 'El apellido es requerido';
    if (form.password && form.password !== form.confirm) {
      newErrors.confirm = 'Las contraseñas no coinciden';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!usuario?.id) return;

    setLoading(true);
    setApiError('');
    setSuccessMsg('');
    try {
      const payload: { nombre: string; apellido: string; telefono?: string; password?: string } = {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono || undefined,
      };
      if (form.password) payload.password = form.password;

      await api.put(`/usuarios/${usuario.id}`, payload);
      setForm((prev) => ({ ...prev, password: '', confirm: '' }));
      setErrors({});
      setSuccessMsg('Perfil actualizado correctamente');
    } catch {
      setApiError('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <Card title="Mi Perfil" className="profile__card">
        <div className="profile__info">
          <p><span>Email:</span> {usuario?.email}</p>
          <p><span>DNI:</span> {usuario?.dni}</p>
          {usuario?.rol && <p><span>Rol:</span> {usuario.rol}</p>}
        </div>

        <form onSubmit={handleSubmit} className="profile__form" noValidate>
          <Input
            id="nombre"
            label="Nombre"
            type="text"
            value={form.nombre}
            error={errors.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <Input
            id="apellido"
            label="Apellido"
            type="text"
            value={form.apellido}
            error={errors.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          />
          <Input
            id="telefono"
            label="Teléfono (opcional)"
            type="text"
            placeholder="11 1234-5678"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
          <Input
            id="password"
            label="Nueva contraseña (opcional)"
            type="password"
            placeholder="Dejar vacío para no cambiarla"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Input
            id="confirm"
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            value={form.confirm}
            error={errors.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          {apiError && <p className="form__api-error">{apiError}</p>}
          {successMsg && <p className="form__success">{successMsg}</p>}
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;

