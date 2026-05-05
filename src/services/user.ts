import { api } from './api';
import type { Usuario, UpdateProfileRequest } from '../types';

export const userService = {
  getProfile: (id: number) =>
    api.get<Usuario>(`/api/usuarios/${id}`),

  updateProfile: (id: number, data: UpdateProfileRequest) =>
    api.put<Usuario>(`/api/usuarios/${id}`, data),
};
