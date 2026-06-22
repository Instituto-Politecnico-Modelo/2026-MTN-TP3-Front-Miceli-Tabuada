import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/user';
import { reservasService } from '../../services/reservas';
import type { UsuarioResponse, ReservaResponse } from '../../types';
import axios from 'axios';

const ESTADOS_BADGE: Record<string, string> = {
  PENDIENTE: '#f59e0b',
  CONFIRMADA: '#16a34a',
  CANCELADA: '#6b7280',
};

const UsuariosPanel = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reservasMap, setReservasMap] = useState<Record<number, ReservaResponse[]>>({});
  const [cancelModal, setCancelModal] = useState<{ open: boolean; reservaId: number | null }>({ open: false, reservaId: null });
  const [motivo, setMotivo] = useState('');
  const [canceling, setCanceling] = useState(false);

  const fetchUsuarios = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await userService.getAll(p, 10);
      setUsuarios(res.data.content);
      setTotalPages(Math.max(1, Math.ceil(res.data.totalElements / 10)));
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchUsuarios(page); }, [page, fetchUsuarios]);

  const handleExpand = async (id: number) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (reservasMap[id]) return;
    try {
      const res = await userService.getReservasByUsuario(id);
      setReservasMap((prev) => ({ ...prev, [id]: res.data }));
    } catch {
      setReservasMap((prev) => ({ ...prev, [id]: [] }));
    }
  };

  const openCancelModal = (reservaId: number) => { setMotivo(''); setCancelModal({ open: true, reservaId }); };

  const handleCancelarAdmin = async () => {
    if (!cancelModal.reservaId) return;
    setCanceling(true);
    try {
      await reservasService.cancelarReservaAdmin(cancelModal.reservaId, motivo);
      setCancelModal({ open: false, reservaId: null });
      // refresh reservas for expanded user
      if (expandedId !== null) {
        const res = await userService.getReservasByUsuario(expandedId);
        setReservasMap((prev) => ({ ...prev, [expandedId]: res.data }));
      }
    } catch (err: unknown) {
      let msg = 'No se pudo cancelar la reserva.';
      if (axios.isAxiosError(err)) {
        msg = (err.response?.data as { error?: string })?.error ?? msg;
      }
      alert(msg);
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Gestión de Usuarios</h1>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {loading ? <p>Cargando...</p> : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>DNI</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <>
                  <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.5rem' }}>{u.nombre} {u.apellido}</td>
                    <td style={{ padding: '0.5rem' }}>{u.email}</td>
                    <td style={{ padding: '0.5rem' }}>{u.dni}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button onClick={() => void handleExpand(u.id)} style={btnStyle('#374151')}>
                        {expandedId === u.id ? '▲ Cerrar' : '▼ Reservas'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === u.id && (
                    <tr key={`reservas-${u.id}`}>
                      <td colSpan={4} style={{ background: '#f9fafb', padding: '1rem' }}>
                        {(reservasMap[u.id] ?? []).length === 0 ? (
                          <p style={{ color: '#6b7280' }}>Sin reservas.</p>
                        ) : (
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                              <tr>
                                <th style={{ textAlign: 'left', padding: '0.3rem' }}>Fecha</th>
                                <th style={{ textAlign: 'left', padding: '0.3rem' }}>Cancha</th>
                                <th style={{ textAlign: 'left', padding: '0.3rem' }}>Estado</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              {(reservasMap[u.id] ?? []).map((r) => (
                                <tr key={r.id}>
                                  <td style={{ padding: '0.3rem' }}>{r.fecha}</td>
                                  <td style={{ padding: '0.3rem' }}>{r.canchaNombre ?? '—'}</td>
                                  <td style={{ padding: '0.3rem' }}>
                                    <span style={{ background: ESTADOS_BADGE[r.estado] ?? '#6b7280', color: '#fff', padding: '1px 6px', borderRadius: 9999, fontSize: '0.75rem' }}>
                                      {r.estado}
                                    </span>
                                  </td>
                                  <td style={{ padding: '0.3rem' }}>
                                    {(r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA') && (
                                      <button onClick={() => openCancelModal(r.id)} style={btnStyle('#dc2626')}>Cancelar</button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} style={btnStyle('#374151')}>← Anterior</button>
            <span style={{ padding: '0.3rem 0.6rem' }}>Pág. {page + 1} de {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} style={btnStyle('#374151')}>Siguiente →</button>
          </div>
        </>
      )}

      {/* Modal cancelación admin */}
      {cancelModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, minWidth: 360 }}>
            <h2>Cancelar Reserva</h2>
            <label>
              Motivo:
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
                style={{ display: 'block', width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4, marginTop: '0.25rem' }}
              />
            </label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setCancelModal({ open: false, reservaId: null })} style={btnStyle('#6b7280')}>Cancelar</button>
              <button onClick={() => void handleCancelarAdmin()} disabled={canceling} style={btnStyle('#dc2626')}>
                {canceling ? 'Cancelando...' : 'Confirmar cancelación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const btnStyle = (bg: string): React.CSSProperties => ({ background: bg, color: '#fff', border: 'none', borderRadius: 4, padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.85rem' });

export default UsuariosPanel;
