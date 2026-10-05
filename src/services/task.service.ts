import { apiFetch, type ApiResponse } from './api';

// 1. Modelo de datos de una Tarea
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  projectId?: string;
  proyectId?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

// 2. Objetos de transferencia de datos (DTOs)
export interface CreateTaskDTO {
  title: string;
  description: string;
  projectId?: string;
  proyectId?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
}

// 3. Metadatos y contrato de respuesta paginada
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedTasksResponse {
  items: Task[];
  pagination: PaginationMeta;
}

/**
 * Obtener tareas (paginadas por proyecto o globales)
 * Endpoint: GET /tasks/:projectId?page=X&limit=Y o GET /tasks
 */
export async function getTasksRequest(
  projectId?: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedTasksResponse>> {
  const endpoint = projectId
    ? `/tasks/${projectId}?page=${page}&limit=${limit}`
    : `/tasks?page=${page}&limit=${limit}`;

  return apiFetch<PaginatedTasksResponse>(endpoint);
}

/**
 * Crear una nueva tarea
 * Soporta firmas:
 * - createTaskRequest(projectId, taskData)
 * - createTaskRequest(taskData)
 */
export async function createTaskRequest(
  projectIdOrData: string | CreateTaskDTO,
  taskData?: CreateTaskDTO
): Promise<ApiResponse<Task>> {
  let targetProjectId: string | undefined;
  let bodyData: CreateTaskDTO;

  if (typeof projectIdOrData === 'string') {
    targetProjectId = projectIdOrData;
    bodyData = taskData || { title: '', description: '' };
  } else {
    targetProjectId = projectIdOrData.projectId || projectIdOrData.proyectId;
    bodyData = projectIdOrData;
  }

  const endpoint = targetProjectId ? `/tasks/${targetProjectId}` : '/tasks';

  return apiFetch<Task>(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      title: bodyData.title,
      description: bodyData.description,
    }),
  });
}

/**
 * Actualizar tarea
 * Soporta firmas:
 * - updateTaskRequest(projectId, id, taskData)
 * - updateTaskRequest(id, taskData)
 */
export async function updateTaskRequest(
  projectIdOrId: string,
  idOrData: string | UpdateTaskDTO,
  taskData?: UpdateTaskDTO
): Promise<ApiResponse<Task>> {
  if (typeof idOrData === 'string') {
    // Llamado como updateTaskRequest(projectId, id, taskData)
    return apiFetch<Task>(`/tasks/${projectIdOrId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        id: idOrData,
        ...taskData,
      }),
    });
  }

  // Llamado como updateTaskRequest(id, taskData)
  return apiFetch<Task>(`/tasks/${projectIdOrId}`, {
    method: 'PUT',
    body: JSON.stringify(idOrData),
  });
}

/**
 * Alternar estado completado de una tarea
 * Soporta firmas:
 * - completeTaskRequest(projectId, id)
 * - completeTaskRequest(id)
 */
export async function completeTaskRequest(
  projectIdOrId: string,
  maybeId?: string
): Promise<ApiResponse<Task>> {
  if (maybeId) {
    return apiFetch<Task>(`/tasks/${projectIdOrId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ id: maybeId }),
    });
  }

  return apiFetch<Task>(`/tasks/${projectIdOrId}/complete`, {
    method: 'PATCH',
  });
}

/**
 * Marcar una tarea como pendiente nuevamente
 * Soporta firmas:
 * - pendingTaskRequest(projectId, id)
 * - pendingTaskRequest(id)
 */
export async function pendingTaskRequest(
  projectIdOrId: string,
  maybeId?: string
): Promise<ApiResponse<Task>> {
  if (maybeId) {
    return apiFetch<Task>(`/tasks/${projectIdOrId}/pending`, {
      method: 'PATCH',
      body: JSON.stringify({ id: maybeId }),
    });
  }

  return apiFetch<Task>(`/tasks/${projectIdOrId}/pending`, {
    method: 'PATCH',
  });
}

/**
 * Eliminar una tarea
 * Soporta firmas:
 * - deleteTaskRequest(projectId, id)
 * - deleteTaskRequest(id)
 */
export async function deleteTaskRequest(
  projectIdOrId: string,
  maybeId?: string
): Promise<ApiResponse<null>> {
  if (maybeId) {
    return apiFetch<null>(`/tasks/${projectIdOrId}`, {
      method: 'DELETE',
      body: JSON.stringify({ id: maybeId }),
    });
  }

  return apiFetch<null>(`/tasks/${projectIdOrId}`, {
    method: 'DELETE',
  });
}
