import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { reservasService } from '../../services/reservas';
import type { ClimaResponse } from '../../types';
import axios from 'axios';

const NuevaReserva = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [paso, setPaso] = useState(1);
  const [turnoId, setTurnoId] = useState(searchParams.get('turnoId') ?? '');
  const [fecha, setFecha] = useState(searchParams.get('fecha') ?? new Date().toISOString().split('T')[0]);
  const [clima, setClima] = useState<ClimaResponse | null>(null);
  const [loadingClima, setLoadingClima] = useState(false);
  const [loadingReserva, setLoadingReserva] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const fetchClima = async () => {
    if (!fecha) return;
    setLoadingClima(true);
    try {
      const res = await reservasService.getClimaParaTurno(fecha, '18:00:00');
      setClima(res.data);
    } catch {
      setClima({ disponible: false, descripcion: null, temperatura: null, sensacionTermica: null, lluvia: null, viento: null, humedad: null, icono: null });
    } finally {
      setLoadingClima(false);
    }
  };

  const handlePaso1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnoId || !fecha) {
      setError('Completá todos los campos.');
      return;
    }
    setError('');
    void fetchClima();
    setPaso(2);
  };

  const handleConfirmar = async () => {
    setLoadingReserva(true);
    setError('');
    try {
      const res = await reservasService.createReserva({ turnoId: Number(turnoId), fecha });
      const redirectUrl = res.data.pagoRedirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        navigate('/cliente/dashboard');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError('El turno ya está reservado para esa fecha. Elegí otro.');
      } else {
        setError('No se pudo crear la reserva. Intentá nuevamente.');
      }
    } finally {
      setLoadingReserva(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>Nueva Reserva</h1>

      {/* Paso 1 — Seleccionar turno y fecha */}
      {paso === 1 && (
        <form onSubmit={handlePaso1} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>
            ID de Turno:
            <input type="number" value={turnoId} onChange={(e) => setTurnoId(e.target.value)} required style={{ display: 'block', width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4 }} />
          </label>
          <label>
            Fecha:
            <input type="date" value={fecha} min={today} onChange={(e) => setFecha(e.target.value)} required style={{ display: 'block', width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4 }} />
          </label>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
          <button type="submit" style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4 }}>Siguiente →</button>
        </form>
      )}

      {/* Paso 2 — Clima */}
      {paso === 2 && (
        <div>
          <h2>Pronóstico del tiempo</h2>
          {loadingClima ? (
            <p>Cargando pronóstico...</p>
          ) : clima?.disponible ? (
            <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
              <p>{clima.descripcion}</p>
              <p>🌡 {clima.temperatura}°C — Sensación {clima.sensacionTermica}°C</p>
              {clima.lluvia != null && clima.lluvia > 0 && <p>🌧 Lluvia: {clima.lluvia} mm</p>}
              <p>💨 Viento: {clima.viento} km/h</p>
            </div>
          ) : (
            <div style={{ background: '#fef9c3', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
              <p>⚠️ Pronóstico no disponible por el momento.</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setPaso(1)} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: 4 }}>← Volver</button>
            <button onClick={() => setPaso(3)} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4 }}>Confirmar reserva →</button>
          </div>
        </div>
      )}

      {/* Paso 3 — Confirmación */}
      {paso === 3 && (
        <div>
          <h2>Confirmación</h2>
          <p>Turno ID: <strong>{turnoId}</strong></p>
          <p>Fecha: <strong>{fecha}</strong></p>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Se generará un link de pago de Mercado Pago. La reserva queda pendiente hasta completar el pago.</p>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setPaso(2)} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: 4 }}>← Volver</button>
            <button onClick={() => void handleConfirmar()} disabled={loadingReserva} style={{ padding: '0.5rem 1rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4 }}>
              {loadingReserva ? 'Procesando...' : '💳 Ir a pagar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevaReserva;
