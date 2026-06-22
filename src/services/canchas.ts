import api from './api';
import type { CanchaResponse, CanchaRequest } from '../types';

export const canchasService = {
  getAllCanchas: () =>
    api.get<CanchaResponse[]>('/admin/canchas'),

  createCancha: (req: CanchaRequest) =>
    api.post<CanchaResponse>('/admin/canchas', req),

  updateCancha: (id: number, req: CanchaRequest) =>
    api.put<CanchaResponse>(`/admin/canchas/${id}`, req),

  deleteCancha: (id: number) =>
    api.delete<void>(`/admin/canchas/${id}`),

  updateEstadoCancha: (id: number, activa: boolean) =>
    api.patch<CanchaResponse>(`/admin/canchas/${id}/estado`, null, { params: { activa } }),
};
