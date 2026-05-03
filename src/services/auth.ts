import { api } from './api';
import type { RegisterRequest, LoginRequest, AuthResponse, Usuario } from '../types';

// Agrupa las llamadas al servidor relacionadas con autenticacion.
// Las paginas usan esto en lugar de llamar a fetch directamente.
export const authService = {
  // Crea un usuario nuevo en el servidor con los datos del formulario de registro.
  register: (data: RegisterRequest) =>
    api.post<Usuario>('/api/auth/registro', data),

  // Verifica las credenciales del usuario y devuelve un token JWT si son correctas.
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data),
};
