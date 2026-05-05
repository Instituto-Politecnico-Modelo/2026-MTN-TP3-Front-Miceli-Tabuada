import { api } from './api';
import type { RegisterRequest, LoginRequest, AuthResponse, Usuario } from '../types';

export const authService = {
  register: (data: RegisterRequest) =>
    api.post<Usuario>('/api/auth/registro', data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data),
};
