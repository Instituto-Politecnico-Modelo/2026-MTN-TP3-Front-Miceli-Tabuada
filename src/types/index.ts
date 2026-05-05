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

export interface RegisterRequest {
  dni: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// El token JWT devuelto por el backend se almacena en localStorage
// y se usa para autenticar las peticiones posteriores.
export interface AuthResponse {
  token: string;
}

// Campos que el usuario puede editar desde su perfil.
// El DNI, email y rol son inmutables desde el cliente.
export interface UpdateProfileRequest {
  nombre: string;
  apellido: string;
  telefono?: string;
  password?: string;
}
