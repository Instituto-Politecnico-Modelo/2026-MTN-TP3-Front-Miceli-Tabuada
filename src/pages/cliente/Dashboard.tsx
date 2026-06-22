import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { reservasService } from '../../services/reservas';
import type { ReservaResponse } from '../../types';
import axios from 'axios';

const ESTADOS_BADGE: Record<string, string> = {
  PENDIENTE: '#f59e0b',
  CONFIRMADA: '#16a34a',
  CANCELADA: '#6b7280',
};

const ClienteDashboard = () => {
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelandoId, setCanceladoId] = useState<number | null>(null);

  const fetchReservas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reservasService.getMisReservas();
      setReservas(res.data);
    } catch {
      setError('No se pudieron cargar las reservas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReservas();
  }, [fetchReservas]);

  const handleCancelar = async (id: number) => {
    if (!confirm('¿Cancelar esta reserva?')) return;
    setCanceladoId(id);
    try {
      await reservasService.cancelarReserva(id);
      await fetchReservas();
    } catch (err: unknown) {
      let msg = 'No se pudo cancelar la reserva.';
      if (axios.isAxiosError(err)) {
        msg = (err.response?.data as { error?: string })?.error ?? msg;
      }
      alert(msg);
    } finally {
      setCanceladoId(null);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando reservas...</p>;
  if (error) return <p style={{ padding: '2rem', color: '#dc2626' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Mis Reservas</h1>
      <Link to="/cliente/nueva-reserva" style={{ display: 'inline-block', marginBottom: '1rem', background: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: 6, textDecoration: 'none' }}>
        + Nueva Reserva
      </Link>
      {reservas.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No tenés reservas aún. ¡Hacé tu primera reserva!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Fecha</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Cancha</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Horario</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>{r.fecha}</td>
                <td style={{ padding: '0.5rem' }}>{r.canchaNombre ?? '—'}</td>
                <td style={{ padding: '0.5rem' }}>{r.horaInicio ?? '—'} – {r.horaFin ?? '—'}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ background: ESTADOS_BADGE[r.estado] ?? '#6b7280', color: '#fff', padding: '2px 8px', borderRadius: 9999, fontSize: '0.8rem' }}>
                    {r.estado}
                  </span>
                </td>
                <td style={{ padding: '0.5rem' }}>
                  {r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA' ? (
                    <button
                      onClick={() => void handleCancelar(r.id)}
                      disabled={cancelandoId === r.id}
                      style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, padding: '0.25rem 0.6rem', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClienteDashboard;
