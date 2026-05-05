import { api } from './api';
import type { Usuario, UpdateProfileRequest } from '../types';

export const userService = {
  getAll: () =>
    api.get<Usuario[]>('/api/usuarios'),

  getProfile: (id: number) =>
    api.get<Usuario>(`/api/usuarios/${id}`),

  updateProfile: (id: number, data: UpdateProfileRequest) =>
    api.put<Usuario>(`/api/usuarios/${id}`, data),

  // Busca el usuario autenticado por email dentro de la lista de usuarios.
  // Se usa para obtener el ID luego del login, ya que el JWT no lo incluye.
  findByEmail: async (email: string): Promise<Usuario | undefined> => {
    const lista = await api.get<Usuario[]>('/api/usuarios');
    return lista.find((u) => u.email === email);
  },
};
