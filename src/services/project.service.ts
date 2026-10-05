import { apiFetch, type ApiResponse } from './api';
import type { Task } from './task.service';

// 1. Modelo de datos de un Proyecto
export interface Project {
  id: string;
  name: string;
  description: string;
  status?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  tasks?: Task[];
}

// 2. Objetos de transferencia de datos (DTOs)
export interface CreateProjectDTO {
  name: string;
  description: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: string;
}

/**
 * Obtener todos los proyectos del usuario autenticado
 * Endpoint: GET /projects
 */
export async function getProjectsRequest(): Promise<ApiResponse<Project[]>> {
  return apiFetch<Project[]>('/projects');
}

/**
 * Obtener un proyecto específico por su ID con sus tareas asociadas
 * Endpoint: GET /projects/:id
 */
export async function getProjectRequest(
  id: string
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`);
}

/**
 * Crear un nuevo proyecto
 * Endpoint: POST /projects
 */
export async function createProjectRequest(
  projectData: CreateProjectDTO
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
}

/**
 * Actualizar los datos de un proyecto existente
 * Endpoint: PUT /projects/:id
 */
export async function updateProjectRequest(
  id: string,
  projectData: UpdateProjectDTO
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
}

/**
 * Eliminar un proyecto (soft delete en el backend)
 * Endpoint: DELETE /projects/:id
 */
export async function deleteProjectRequest(
  id: string
): Promise<ApiResponse<Project | null>> {
  return apiFetch<Project | null>(`/projects/${id}`, {
    method: 'DELETE',
  });
}
