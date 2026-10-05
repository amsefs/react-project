import { API_URL, TOKEN_KEY } from '@/lib/constants';

// 1. Interfaces de Datos de TaskFlow API
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export type RegisterResponseData = User;

/**
 * Cliente HTTP centralizado para TaskFlow API.
 * Inyecta automáticamente el token JWT almacenado en localStorage
 * y estandariza el manejo de respuestas y errores.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Obtenemos el token guardado usando la clave dinámica configurada
  const token = localStorage.getItem(TOKEN_KEY);

  // Construcción de encabezados
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    // Si el backend responde con error HTTP o success: false
    if (!response.ok || !data.success) {
      throw new Error(
        data.message || 'Ocurrió un error al procesar la solicitud'
      );
    }

    return data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Ocurrió un error inesperado al conectar con el servidor';

    console.error(
      `[API Error] ${options.method || 'GET'} ${endpoint}:`,
      errorMessage
    );
    throw error;
  }
}
