import { createContext, useContext, useState, useCallback } from 'react';
import type { Usuario } from '../types';

interface AuthContextValue {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  // Actualiza los datos del usuario en memoria sin necesidad de un nuevo token.
  updateUser: (data: Partial<Usuario>) => void;
}

const TOKEN_KEY = 'token';

// Extrae los datos del usuario del payload del JWT.
// La verificación de firma es responsabilidad del backend.
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

// Mantiene el estado de sesión disponible globalmente.
// Al iniciar, recupera el token guardado para no forzar un nuevo login.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? decodeToken(token) : null;
  });

  const login = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(decodeToken(token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<Usuario>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
