import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservasService } from '../services/reservas';
import type { DisponibilidadItem } from '../types';
import './Grilla.css';

const today = () => new Date().toISOString().split('T')[0];

const Grilla = () => {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState(today());
  const [items, setItems] = useState<DisponibilidadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGrilla = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await reservasService.getDisponibilidad(fecha);
      setItems(res.data);
    } catch {
      setError('No se pudo cargar la disponibilidad. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [fecha]);

  useEffect(() => {
    void fetchGrilla();
  }, [fetchGrilla]);

  return (
    <div className="grilla">
      <h1 className="grilla__title">Disponibilidad de Canchas</h1>
      <div className="grilla__controls">
        <label htmlFor="fecha">Fecha:</label>
        <input
          id="fecha"
          type="date"
          value={fecha}
          min={today()}
          onChange={(e) => setFecha(e.target.value)}
        />
        <button onClick={() => void fetchGrilla()} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {error && <p className="grilla__error">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <p className="grilla__empty">No hay turnos disponibles para esta fecha.</p>
      )}

      <div className="grilla__tabla">
        {items.map((item) => (
          <div
            key={item.turnoId}
            className={`grilla__item ${item.reservado ? 'grilla__item--ocupado' : 'grilla__item--libre'}`}
          >
            <span className="grilla__cancha">{item.canchaNombre}</span>
            <span className="grilla__horario">
              {item.horaInicio} – {item.horaFin}
            </span>
            <span className="grilla__dia">{item.diaSemana}</span>
            <span className={`grilla__estado ${item.reservado ? 'ocupado' : 'libre'}`}>
              {item.reservado ? 'Ocupado' : 'Disponible'}
            </span>
            {!item.reservado && (
              <button
                className="grilla__btn-reservar"
                onClick={() =>
                  navigate(`/cliente/nueva-reserva?turnoId=${item.turnoId}&fecha=${fecha}`)
                }
              >
                Reservar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grilla;
