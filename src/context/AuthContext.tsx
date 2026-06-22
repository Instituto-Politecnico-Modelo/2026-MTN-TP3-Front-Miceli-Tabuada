import { createContext, useContext, useState, useCallback } from 'react';
import type { UsuarioResponse, Rol } from '../types';
import api from '../services/api';

const TOKEN_KEY = 'token';

interface StoredAuth {
  token: string;
  rol: Rol;
  usuarioId: number;
  email: string;
}

export interface AuthContextValue {
  usuario: UsuarioResponse | null;
  token: string | null;
  rol: Rol | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (r: Rol) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function loadStored(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [stored, setStored] = useState<StoredAuth | null>(loadStored);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<StoredAuth>('/auth/login', { email, password });
    const data: StoredAuth = {
      token: res.data.token,
      rol: res.data.rol,
      usuarioId: res.data.usuarioId,
      email: res.data.email,
    };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
    setStored(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setStored(null);
    void api.post('/auth/logout', {}).catch(() => undefined);
  }, []);

  const hasRole = useCallback((r: Rol) => stored?.rol === r, [stored]);

  const usuario: UsuarioResponse | null = stored
    ? {
        id: stored.usuarioId,
        dni: '',
        nombre: '',
        apellido: '',
        email: stored.email,
        telefono: null,
        rol: stored.rol,
        activo: true,
        fechaRegistro: null,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token: stored?.token ?? null,
        rol: stored?.rol ?? null,
        isAuthenticated: stored !== null,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

