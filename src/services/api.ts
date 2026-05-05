// Con CORS configurado en el backend, apuntamos directamente al puerto 8081.
// El proxy de Vite sigue activo como respaldo, pero ya no es necesario.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

// Todas las peticiones al backend pasan por aca.
// Si la respuesta no es exitosa, convierte el mensaje del servidor en una excepción.
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

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
