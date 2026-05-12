import { createContext, useContext, useState, useCallback } from 'react';
import type { Usuario } from '../types';

// auth context value guarda el usuario autenticado.
interface AuthContextValue {
  user: Usuario | null; // null si no hay usuario autenticado.
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void; 
  // Actualiza los datos del usuario en memoria sin necesidad de un nuevo token.
  updateUser: (data: Partial<Usuario>) => void;
}

const TOKEN_KEY = 'token';

//la verificación de firma es responsabilidad del backend.
//decode token es una función simple que decodifica el payload del JWT para obtener los datos del usuario.
// no verifica la firma ni la validez del token, por lo que se asume que el token es confiable.
// si el token no es válido o no tiene el formato esperado, devuelve null.
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
// authcontext guarda el estado de la sesion del usuario y funciones para login, logout y actualizar el usuario. (lo de AuthContextValue)
const AuthContext = createContext<AuthContextValue | null>(null); // El valor inicial es null, lo que indica que no hay usuario autenticado.

//auth provider es un componente que envuelve la aplicacion y le da contexto de la autenticacion a los hijos
// maneja el estado del usuario autenticado, funciones para login, logout y actualizar el usuario. (esta en app,tsx)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? decodeToken(token) : null;
  });

  const login = useCallback((token: string) => { //usecallback es buena practica pq evita que las funciones se creen devuelta en cada render.
    localStorage.setItem(TOKEN_KEY, token);
    setUser(decodeToken(token));// actualiza el estado del usuario con los datos decodificados del token.
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<Usuario>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }, []);

  return ( //returnea un provider con el contexto del usuario autenticado con su JWT.
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
