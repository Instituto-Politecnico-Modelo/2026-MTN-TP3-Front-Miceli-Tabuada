// Tipos base del proyecto
// Extender según las necesidades del TP

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ── Auth / Usuario ──────────────────────────────────────────────

// [Issue 20] Modela la entidad Usuario del backend (tabla `usuarios`).
// Los campos opcionales (?) no son obligatorios en todos los contextos
// (ej: password no se muestra en respuestas, rol lo asigna el backend).
export interface Usuario {
  id?: number;
  dni: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  telefono?: string;
  rol?: string;
}

// [Issue 22] Cuerpo del POST /api/auth/registro.
// Coincide exactamente con los campos requeridos por el modelo Usuario del backend.
export interface RegisterRequest {
  dni: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
}

// [Issue 24] Cuerpo del POST /api/auth/login (LoginRequestDTO del backend).
export interface LoginRequest {
  email: string;
  password: string;
}

// [Issue 24] Respuesta del POST /api/auth/login (AuthResponseDTO del backend).
// Contiene el token JWT que se almacena en localStorage para autenticar
// las siguientes peticiones.
export interface AuthResponse {
  token: string;
}
