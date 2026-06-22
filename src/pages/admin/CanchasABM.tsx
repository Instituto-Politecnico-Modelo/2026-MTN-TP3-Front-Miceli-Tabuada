import { useState, useEffect, useCallback } from 'react';
import { canchasService } from '../../services/canchas';
import type { CanchaResponse, CanchaRequest } from '../../types';
import axios from 'axios';

const TIPOS = ['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11'] as const;
const empty = (): CanchaRequest => ({ nombre: '', tipo: 'FUTBOL_5', descripcion: '' });

const CanchasABM = () => {
  const [canchas, setCanchas] = useState<CanchaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ open: boolean; editing: CanchaResponse | null }>({ open: false, editing: null });
  const [form, setForm] = useState<CanchaRequest>(empty());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCanchas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await canchasService.getAllCanchas();
      setCanchas(res.data);
    } catch {
      setError('No se pudieron cargar las canchas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchCanchas(); }, [fetchCanchas]);

  const openCreate = () => { setForm(empty()); setFormError(''); setModal({ open: true, editing: null }); };
  const openEdit = (c: CanchaResponse) => {
    setForm({ nombre: c.nombre, tipo: c.tipo, descripcion: c.descripcion ?? '' });
    setFormError('');
    setModal({ open: true, editing: c });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (modal.editing) {
        await canchasService.updateCancha(modal.editing.id, form);
      } else {
        await canchasService.createCancha(form);
      }
      setModal({ open: false, editing: null });
      await fetchCanchas();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setFormError((err.response?.data as { error?: string })?.error ?? 'Error al guardar.');
      } else {
        setFormError('Error al guardar.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEstado = async (c: CanchaResponse) => {
    try {
      await canchasService.updateEstadoCancha(c.id, !c.activa);
      await fetchCanchas();
    } catch {
      alert('No se pudo cambiar el estado.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta cancha? Esta acción no se puede deshacer.')) return;
    try {
      await canchasService.deleteCancha(id);
      await fetchCanchas();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        alert('No se puede eliminar: la cancha tiene turnos asociados.');
      } else {
        alert('No se pudo eliminar la cancha.');
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Gestión de Canchas</h1>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      <button onClick={openCreate} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', marginBottom: '1rem', cursor: 'pointer' }}>+ Nueva Cancha</button>

      {loading ? <p>Cargando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nombre</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Tipo</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {canchas.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>{c.nombre}</td>
                <td style={{ padding: '0.5rem' }}>{c.tipo}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ background: c.activa ? '#16a34a' : '#6b7280', color: '#fff', padding: '2px 8px', borderRadius: 9999, fontSize: '0.8rem' }}>
                    {c.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEdit(c)} style={btnStyle('#374151')}>Editar</button>
                  <button onClick={() => void handleToggleEstado(c)} style={btnStyle(c.activa ? '#f59e0b' : '#16a34a')}>
                    {c.activa ? 'Desactivar' : 'Activar'}
                  </button>
                  <button onClick={() => void handleDelete(c.id)} style={btnStyle('#dc2626')}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, minWidth: 360 }}>
            <h2>{modal.editing ? 'Editar Cancha' : 'Nueva Cancha'}</h2>
            <form onSubmit={(e) => void handleSave(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label>
                Nombre:
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required style={inputStyle} />
              </label>
              <label>
                Tipo:
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as CanchaRequest['tipo'] })} style={inputStyle}>
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>
                Descripción:
                <input value={form.descripcion ?? ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} style={inputStyle} />
              </label>
              {formError && <p style={{ color: '#dc2626' }}>{formError}</p>}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModal({ open: false, editing: null })} style={btnStyle('#6b7280')}>Cancelar</button>
                <button type="submit" disabled={saving} style={btnStyle('#2563eb')}>{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const btnStyle = (bg: string): React.CSSProperties => ({ background: bg, color: '#fff', border: 'none', borderRadius: 4, padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.85rem' });
const inputStyle: React.CSSProperties = { display: 'block', width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4, marginTop: '0.25rem' };

export default CanchasABM;
