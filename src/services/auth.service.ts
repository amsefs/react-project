import {
  apiFetch,
  type ApiResponse,
  type LoginResponseData,
  type RegisterResponseData,
  type User,
} from './api';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Registrar un nuevo usuario en TaskFlow API
 * Endpoint: POST /auth/register
 * Respuesta: { success: true, message: "Usuario registrado", data: { id, name, email } }
 */
export async function registerRequest(
  credentials: RegisterDTO
): Promise<ApiResponse<RegisterResponseData>> {
  return apiFetch<RegisterResponseData>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Iniciar sesión con email y contraseña
 * Endpoint: POST /auth/login
 * Respuesta: { success: true, message: "Inicio de sesión exitoso", data: { token, user } }
 */
export async function loginRequest(
  credentials: LoginDTO
): Promise<ApiResponse<LoginResponseData>> {
  return apiFetch<LoginResponseData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Obtener el perfil del usuario autenticado actual mediante su token JWT
 * Endpoint: GET /auth/me
 * Respuesta: { success: true, message: "...", data: { id, name, email } }
 */
export async function getMeRequest(): Promise<ApiResponse<User>> {
  return apiFetch<User>('/auth/me');
}
