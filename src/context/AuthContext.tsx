import { createContext, useContext, useState, useCallback } from 'react';
import type { Usuario } from '../types';

// Todo lo que el resto de la app puede saber o hacer con la sesion del usuario.
interface AuthContextValue {
  // El usuario que esta logueado, o null si no hay nadie.
  user: Usuario | null;
  // Verdadero si hay una sesion activa, falso si no.
  isAuthenticated: boolean;
  // Guarda el token en el navegador y actualiza quien esta logueado.
  login: (token: string) => void;
  // Borra el token y deja la sesion completamente vacia.
  logout: () => void;
}

const TOKEN_KEY = 'token';

// Abre el JWT y extrae los datos del usuario que estan guardados adentro.
// No verifica la firma porque eso le corresponde al backend, no al cliente.
function decodeToken(token: string): Usuario | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64)) as Record<string, unknown>;
    return {
      id:       typeof payload.id       === 'number' ? payload.id       : undefined,
      dni:      typeof payload.dni      === 'number' ? payload.dni      : 0,
      nombre:   typeof payload.nombre   === 'string' ? payload.nombre   : '',
      apellido: typeof payload.apellido === 'string' ? payload.apellido : '',
      email:    typeof payload.email    === 'string' ? payload.email    :
                typeof payload.sub      === 'string' ? payload.sub      : '',
      rol:      typeof payload.rol      === 'string' ? payload.rol      :
                typeof payload.role     === 'string' ? payload.role     : undefined,
    };
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Envuelve la app y mantiene el estado de sesion disponible para todos los componentes.
// Al arrancar, mira si ya habia un token guardado para no obligar al usuario a loguearse de nuevo.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? decodeToken(token) : null;
  });

  // Cuando el backend devuelve el token, lo guardamos y actualizamos el usuario en pantalla.
  const login = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(decodeToken(token));
  }, []);

  // Al cerrar sesion borramos el token del navegador y limpiamos el estado.
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para leer o modificar la sesion desde cualquier componente.
// Si se usa fuera del AuthProvider lanza un error para avisar que algo esta mal armado.
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
