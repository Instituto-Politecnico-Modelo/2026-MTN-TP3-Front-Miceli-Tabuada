// Direccion del servidor al que apuntan todos los pedidos. Se puede cambiar con una variable de entorno sin tocar el codigo.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Todos los pedidos al servidor pasan por aca. Si la respuesta no es exitosa,
// convierte el mensaje de error del servidor en una excepcion para que los formularios puedan mostrarlo.
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
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

// Los cuatro tipos de pedido que usamos en la app, listos para llamar desde cualquier servicio.
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
