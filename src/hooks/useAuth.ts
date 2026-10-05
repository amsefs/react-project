import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/context/AuthContext';

/**
 * Custom Hook para consumir el contexto global de autenticación (TaskFlow Auth).
 *
 * Centraliza el acceso al estado de sesión (user, token, isAuthenticated, isLoading)
 * y a los métodos de autenticación (login, register, logout).
 *
 * @returns {AuthContextType} Objeto garantizado con el estado y métodos de autenticación
 * @throws {Error} Si el hook se invoca fuera del árbol de un <AuthProvider>
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  // Verificación de seguridad y fail-fast en tiempo de desarrollo
  if (!context) {
    throw new Error(
      'useAuth debe ser utilizado dentro de un componente envuelto por <AuthProvider>'
    );
  }

  return context;
}
