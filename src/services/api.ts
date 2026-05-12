//el CORS (cross-origin resource sharing) permite que el frontend haga peticiones al backend DIRECTAMENTE.
//el proxy de vite es una funcionalidad del servidor de desarrollo que actúa como intermediario entre la aplicación frontendy  un servidor backend
// El proxy de Vite sigue activo como respaldo, pero ya no es necesario porque esta configurado el CORS
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

// Todas las peticiones al backend pasan por aca.
// El token JWT se adjunta automáticamente cuando existe en localStorage.
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) { //Si la respuesta del backend devuelve un error, se lee el mensaje y se lanza una excepción.
    const error = await response.text();
    throw new Error(error || `HTTP error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// Funciones para cada recurso del backend. Se encargan de construir la URL y el cuerpo de la petición.
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
