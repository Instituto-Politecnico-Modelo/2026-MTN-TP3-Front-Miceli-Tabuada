import api from './api';
import type { RegistroRequest, UsuarioResponse } from '../types';

export const authService = {
  registro: (data: RegistroRequest) =>
    api.post<UsuarioResponse>('/auth/registro', data),

  logout: () =>
    api.post<void>('/auth/logout', {}),
};

