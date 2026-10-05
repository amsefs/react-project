import { createContext } from 'react';
import type { User } from '@/services/api';
import type { LoginDTO, RegisterDTO } from '@/services/auth.service';

// 1. Contrato de datos que compartirá el contexto con toda la aplicación
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  register: (credentials: RegisterDTO) => Promise<void>;
  logout: () => void;
}

// 2. Creación del contexto (inicialmente undefined hasta que sea provisto)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
