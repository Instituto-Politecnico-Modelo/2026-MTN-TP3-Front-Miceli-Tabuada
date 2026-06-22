import type { Rol } from '../types';

export interface RouteConfig {
  path: string;
  requiredRole: Rol | null;
}

export const ROUTES = {
  HOME: { path: '/', requiredRole: null },
  LOGIN: { path: '/login', requiredRole: null },
  REGISTRO: { path: '/registro', requiredRole: null },
  GRILLA: { path: '/grilla', requiredRole: null },
  CLIENTE_DASHBOARD: { path: '/cliente/dashboard', requiredRole: 'CLIENTE' as Rol },
  CLIENTE_NUEVA_RESERVA: { path: '/cliente/nueva-reserva', requiredRole: 'CLIENTE' as Rol },
  ADMIN_DASHBOARD: { path: '/admin/dashboard', requiredRole: 'ADMINISTRADOR' as Rol },
  ADMIN_CANCHAS: { path: '/admin/canchas', requiredRole: 'ADMINISTRADOR' as Rol },
  ADMIN_TURNOS: { path: '/admin/turnos', requiredRole: 'ADMINISTRADOR' as Rol },
  ADMIN_USUARIOS: { path: '/admin/usuarios', requiredRole: 'ADMINISTRADOR' as Rol },
} as const satisfies Record<string, RouteConfig>;

// Legacy exports for backward compatibility
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
} as const;

export const PRIVATE_ROUTES = {
  DASHBOARD: '/cliente/dashboard',
  PROFILE: '/perfil',
} as const;

