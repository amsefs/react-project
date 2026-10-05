/**
 * Constantes globales de configuración de la aplicación.
 * Centraliza la lectura de variables de entorno con fallbacks seguros.
 */

// Nombre público de la aplicación
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TaskFlow';

// Clave utilizada para almacenar el token JWT en el LocalStorage
export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'taskflow_token';

// Clave utilizada para almacenar los datos del usuario en el LocalStorage
export const USER_KEY = import.meta.env.VITE_USER_KEY || 'taskflow_user';

// URL base del backend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
