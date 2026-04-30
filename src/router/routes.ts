/**
 * Rutas públicas — accesibles sin autenticación
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  NOT_FOUND: '*',
} as const;

/**
 * Rutas privadas — requieren usuario autenticado
 * Agregar aquí las rutas del dominio del TP
 */
export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  // Ejemplo de recurso CRUD:
  // LIST:   '/items'
  // DETAIL: '/items/:id'
  // CREATE: '/items/new'
  // EDIT:   '/items/:id/edit'
} as const;
