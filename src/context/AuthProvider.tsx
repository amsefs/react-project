import { useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/services/api';
import {
  loginRequest,
  registerRequest,
  type LoginDTO,
  type RegisterDTO,
} from '@/services/auth.service';
import { AuthContext, type AuthContextType } from './AuthContext';
import { TOKEN_KEY, USER_KEY } from '@/lib/constants';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Función auxiliar para verificar si un token JWT no está expirado
 */
function isTokenValid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Función auxiliar para recuperar datos básicos del usuario a partir del token JWT
 */
function extractUserFromToken(token: string): User | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.id || '',
      name: payload.name || payload.email?.split('@')[0] || 'Usuario',
      email: payload.email || '',
    };
  } catch {
    return null;
  }
}

function getInitialToken(): string | null {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  return storedToken && isTokenValid(storedToken) ? storedToken : null;
}

function getInitialUser(initialToken: string | null): User | null {
  if (!initialToken) return null;
  const storedUser = localStorage.getItem(USER_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      return extractUserFromToken(initialToken);
    }
  }
  return extractUserFromToken(initialToken);
}

/**
 * Componente Proveedor que envuelve la jerarquía de rutas
 * y gestiona el ciclo de vida y persistencia de la sesión del usuario.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [user, setUser] = useState<User | null>(() => getInitialUser(getInitialToken()));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sincronización en caso de cierre de sesión en otra pestaña
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        const currentToken = getInitialToken();
        setToken(currentToken);
        setUser(getInitialUser(currentToken));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Iniciar sesión
  const login = async (credentials: LoginDTO) => {
    setIsLoading(true);
    try {
      const response = await loginRequest(credentials);
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem(TOKEN_KEY, receivedToken);
      localStorage.setItem(USER_KEY, JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Registrarse y autenticar automáticamente
  const register = async (credentials: RegisterDTO) => {
    setIsLoading(true);
    try {
      await registerRequest(credentials);
      await login({ email: credentials.email, password: credentials.password });
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
