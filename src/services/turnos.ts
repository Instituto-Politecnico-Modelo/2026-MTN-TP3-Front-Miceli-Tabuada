import api from './api';
import type { TurnoResponse, TurnoRequest } from '../types';

export const turnosService = {
  getTurnosByCancha: (canchaId: number) =>
    api.get<TurnoResponse[]>(`/admin/canchas/${canchaId}/turnos`),

  createTurno: (canchaId: number, req: TurnoRequest) =>
    api.post<TurnoResponse>(`/admin/canchas/${canchaId}/turnos`, req),

  updateTurno: (canchaId: number, id: number, req: TurnoRequest) =>
    api.put<TurnoResponse>(`/admin/canchas/${canchaId}/turnos/${id}`, req),

  deleteTurno: (canchaId: number, id: number) =>
    api.delete<void>(`/admin/canchas/${canchaId}/turnos/${id}`),

  updateDisponibilidad: (canchaId: number, id: number, disponible: boolean) =>
    api.patch<TurnoResponse>(`/admin/canchas/${canchaId}/turnos/${id}/disponibilidad`, null, {
      params: { disponible },
    }),
};
