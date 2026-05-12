import { api } from './api';
import type { RegisterRequest, LoginRequest, AuthResponse, Usuario } from '../types';

export const authService = {
  // El registro crea un usuario en POST /api/usuarios (endpoint público del backend)
  register: (data: RegisterRequest) =>
    api.post<Usuario>('/api/usuarios', data), //hace el post que esta definido en api.ts, que a su vez hace el fetch al backend. devuelve el usuario creado.

  // El login autentica y devuelve el JWT en POST /api/auth/login
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data),
};
