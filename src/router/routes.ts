// [Issue 18] Centraliza todas las rutas de la app como constantes tipadas.
// Usar estas constantes en AppRouter y en los <Link> evita strings hardcodeados.

// Rutas públicas — accesibles sin autenticación
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  NOT_FOUND: '*',
} as const;

// Rutas privadas — requieren usuario autenticado.
// ProtectedRoute bloquea el acceso si no está autenticado.
export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  // Ejemplo de recurso CRUD:
  // LIST:   '/items'
  // DETAIL: '/items/:id'
  // CREATE: '/items/new'
  // EDIT:   '/items/:id/edit'
} as const;
