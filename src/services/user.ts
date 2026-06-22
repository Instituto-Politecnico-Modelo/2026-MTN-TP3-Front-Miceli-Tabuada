import api from './api';
import type { UsuarioResponse, ReservaResponse } from '../types';

export const userService = {
  getMe: () =>
    api.get<UsuarioResponse>('/usuarios/me'),

  getAll: (page = 0, size = 20) =>
    api.get<{ content: UsuarioResponse[]; totalElements: number }>(`/admin/usuarios?page=${page}&size=${size}`),

  getById: (id: number) =>
    api.get<UsuarioResponse>(`/admin/usuarios/${id}`),

  getReservasByUsuario: (id: number) =>
    api.get<ReservaResponse[]>(`/admin/usuarios/${id}/reservas`),
};

