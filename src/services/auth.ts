import { api } from './api';
import type { RegisterRequest, LoginRequest, AuthResponse, Usuario } from '../types';

export const authService = {
  // El registro crea un usuario en POST /api/usuarios (endpoint público del backend)
  register: (data: RegisterRequest) =>
    api.post<Usuario>('/api/usuarios', data),

  // El login autentica y devuelve el JWT en POST /api/auth/login
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data),
};
