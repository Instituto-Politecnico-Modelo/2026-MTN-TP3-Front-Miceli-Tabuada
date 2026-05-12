//aca definimos todas las rutas y les ponemos un apodo para usar en codigo.
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  NOT_FOUND: '*',
} as const;

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/perfil',
} as const;
