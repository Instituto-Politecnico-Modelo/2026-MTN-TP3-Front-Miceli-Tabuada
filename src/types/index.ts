// ── ENUMs ──────────────────────────────────────────────────────────────────

export type Rol = 'CLIENTE' | 'ADMINISTRADOR';
export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
export type TipoCancha = 'FUTBOL_5' | 'FUTBOL_7' | 'FUTBOL_11';
export type EstadoPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'REEMBOLSADO' | 'CANCELADO';

// ── Response Types ──────────────────────────────────────────────────────────

export interface UsuarioResponse {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  rol: Rol;
  activo: boolean;
  fechaRegistro: string | null;
}

export interface CanchaResponse {
  id: number;
  nombre: string;
  tipo: TipoCancha;
  descripcion: string | null;
  activa: boolean;
}

export interface TurnoResponse {
  id: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
  canchaId: number;
  canchaNombre: string;
}

export interface DisponibilidadItem {
  turnoId: number;
  canchaId: number;
  canchaNombre: string;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  reservado: boolean;
  reservaId: number | null;
}

export interface ReservaResponse {
  id: number;
  fecha: string;
  estado: EstadoReserva;
  motivoCancelacion: string | null;
  turnoId: number;
  diaSemana: string | null;
  horaInicio: string | null;
  horaFin: string | null;
  canchaId: number | null;
  canchaNombre: string | null;
  usuarioId: number;
}

export interface ReservaConPagoResponse {
  reserva: ReservaResponse;
  pagoRedirectUrl: string | null;
  pagoEstado: string;
}

export interface PagoResponse {
  id: number;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  referenciaExterna: string | null;
  preferenceId: string | null;
  fechaTransaccion: string | null;
}

export interface PagoIniciarResponse {
  redirectUrl: string;
  preferenceId: string;
}

export interface ClimaResponse {
  disponible: boolean;
  descripcion: string | null;
  temperatura: number | null;
  sensacionTermica: number | null;
  lluvia: number | null;
  viento: number | null;
  humedad: number | null;
  icono: string | null;
}

export interface AuthResponse {
  token: string;
  rol: Rol;
  usuarioId: number;
  email: string;
}

// ── Request Types ───────────────────────────────────────────────────────────

export interface RegistroRequest {
  dni: string;
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

export interface CanchaRequest {
  nombre: string;
  tipo: TipoCancha;
  descripcion?: string;
  activa?: boolean;
}

export interface TurnoRequest {
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  disponible?: boolean;
}

export interface ReservaRequest {
  turnoId: number;
  fecha: string;
}

// ── Legacy aliases (keep backward compat) ──────────────────────────────────

/** @deprecated Use RegistroRequest */
export type RegisterRequest = RegistroRequest;
/** @deprecated Use UsuarioResponse */
export type Usuario = UsuarioResponse;

