import { useState, useEffect, useCallback } from 'react';
import { canchasService } from '../../services/canchas';
import { turnosService } from '../../services/turnos';
import type { CanchaResponse, TurnoResponse, TurnoRequest } from '../../types';
import axios from 'axios';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'] as const;
const emptyTurno = (): TurnoRequest => ({ diaSemana: 'LUNES', horaInicio: '08:00:00', horaFin: '09:00:00', disponible: true });

const TurnosABM = () => {
  const [canchas, setCanchas] = useState<CanchaResponse[]>([]);
  const [selectedCancha, setSelectedCancha] = useState<number | null>(null);
  const [turnos, setTurnos] = useState<TurnoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; editing: TurnoResponse | null }>({ open: false, editing: null });
  const [form, setForm] = useState<TurnoRequest>(emptyTurno());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    void canchasService.getAllCanchas().then((r) => setCanchas(r.data));
  }, []);

  const fetchTurnos = useCallback(async (canchaId: number) => {
    setLoading(true);
    try {
      const res = await turnosService.getTurnosByCancha(canchaId);
      setTurnos(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectCancha = (id: number) => {
    setSelectedCancha(id);
    void fetchTurnos(id);
  };

  const openCreate = () => { setForm(emptyTurno()); setFormError(''); setModal({ open: true, editing: null }); };
  const openEdit = (t: TurnoResponse) => {
    setForm({ diaSemana: t.diaSemana, horaInicio: t.horaInicio, horaFin: t.horaFin, disponible: t.disponible });
    setFormError('');
    setModal({ open: true, editing: t });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCancha) return;
    setSaving(true);
    setFormError('');
    try {
      if (modal.editing) {
        await turnosService.updateTurno(selectedCancha, modal.editing.id, form);
      } else {
        await turnosService.createTurno(selectedCancha, form);
      }
      setModal({ open: false, editing: null });
      await fetchTurnos(selectedCancha);
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

  const handleToggleDisp = async (t: TurnoResponse) => {
    if (!selectedCancha) return;
    try {
      await turnosService.updateDisponibilidad(selectedCancha, t.id, !t.disponible);
      await fetchTurnos(selectedCancha);
    } catch {
      alert('No se pudo cambiar la disponibilidad.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!selectedCancha || !confirm('¿Eliminar este turno?')) return;
    try {
      await turnosService.deleteTurno(selectedCancha, id);
      await fetchTurnos(selectedCancha);
    } catch {
      alert('No se pudo eliminar el turno.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Gestión de Turnos</h1>

      <label>
        Cancha:
        <select
          value={selectedCancha ?? ''}
          onChange={(e) => handleSelectCancha(Number(e.target.value))}
          style={{ marginLeft: '0.5rem', padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4 }}
        >
          <option value="">— Seleccioná una cancha —</option>
          {canchas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </label>

      {selectedCancha && (
        <>
          <button onClick={openCreate} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', margin: '1rem 0', cursor: 'pointer' }}>+ Nuevo Turno</button>
          {loading ? <p>Cargando...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Día</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Horario</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Disponible</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {turnos.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.5rem' }}>{t.diaSemana}</td>
                    <td style={{ padding: '0.5rem' }}>{t.horaInicio} – {t.horaFin}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ background: t.disponible ? '#16a34a' : '#6b7280', color: '#fff', padding: '2px 8px', borderRadius: 9999, fontSize: '0.8rem' }}>
                        {t.disponible ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(t)} style={btnStyle('#374151')}>Editar</button>
                      <button onClick={() => void handleToggleDisp(t)} style={btnStyle(t.disponible ? '#f59e0b' : '#16a34a')}>{t.disponible ? 'Deshabilitar' : 'Habilitar'}</button>
                      <button onClick={() => void handleDelete(t.id)} style={btnStyle('#dc2626')}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {modal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, minWidth: 360 }}>
            <h2>{modal.editing ? 'Editar Turno' : 'Nuevo Turno'}</h2>
            <form onSubmit={(e) => void handleSave(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label>
                Día:
                <select value={form.diaSemana} onChange={(e) => setForm({ ...form, diaSemana: e.target.value as TurnoRequest['diaSemana'] })} style={inputStyle}>
                  {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label>
                Hora inicio:
                <input type="time" value={form.horaInicio.substring(0, 5)} onChange={(e) => setForm({ ...form, horaInicio: `${e.target.value}:00` })} required style={inputStyle} />
              </label>
              <label>
                Hora fin:
                <input type="time" value={form.horaFin.substring(0, 5)} onChange={(e) => setForm({ ...form, horaFin: `${e.target.value}:00` })} required style={inputStyle} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" checked={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.checked })} />
                Disponible
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

export default TurnosABM;
