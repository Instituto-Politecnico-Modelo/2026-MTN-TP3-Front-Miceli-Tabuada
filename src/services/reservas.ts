import api from './api';
import type {
  DisponibilidadItem,
  ReservaResponse,
  ReservaConPagoResponse,
  ReservaRequest,
  ClimaResponse,
  EstadoReserva,
} from '../types';

export const reservasService = {
  getDisponibilidad: (fecha: string, canchaId?: number) => {
    const params: Record<string, string | number> = { fecha };
    if (canchaId !== undefined) params.canchaId = canchaId;
    return api.get<DisponibilidadItem[]>('/disponibilidad', { params });
  },

  getMisReservas: (estado?: EstadoReserva) =>
    api.get<ReservaResponse[]>('/reservas/mis-reservas', {
      params: estado ? { estado } : undefined,
    }),

  createReserva: (req: ReservaRequest) =>
    api.post<ReservaConPagoResponse>('/reservas', req),

  cancelarReserva: (id: number) =>
    api.put<void>(`/reservas/${id}/cancelar`, {}),

  getClimaParaTurno: (fecha: string, hora: string) =>
    api.get<ClimaResponse>('/clima', { params: { fecha, hora } }),

  // Admin only
  getAllReservas: (filters?: { canchaId?: number; usuarioId?: number; estado?: EstadoReserva; page?: number; size?: number }) =>
    api.get<{ content: ReservaResponse[]; totalElements: number }>('/admin/reservas', { params: filters }),

  cancelarReservaAdmin: (id: number, motivo: string) =>
    api.put<void>(`/admin/reservas/${id}/cancelar`, { motivo }),
};
