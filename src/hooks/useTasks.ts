import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  completeTaskRequest,
  deleteTaskRequest,
  pendingTaskRequest,
  type Task,
  type CreateTaskDTO,
  type UpdateTaskDTO,
} from '@/services/task.service';

function extractItems(data: unknown): Task[] {
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === 'object' &&
    'items' in data &&
    Array.isArray((data as { items: Task[] }).items)
  ) {
    return (data as { items: Task[] }).items;
  }
  return [];
}

/**
 * Custom Hook para gestionar el estado y operaciones CRUD de las tareas
 * integrando retroalimentación visual mediante Toasts y compatibilidad de respuesta.
 */
export function useTasks(activeProjectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Recarga manual de tareas
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTasksRequest(activeProjectId);
      setTasks(extractItems(response.data));
      toast.success('Lista de tareas sincronizada');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar las tareas';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [activeProjectId]);

  // Carga inicial al montar el hook
  useEffect(() => {
    let ignore = false;

    const loadInitialTasks = async () => {
      try {
        const response = await getTasksRequest(activeProjectId);
        if (!ignore) {
          setTasks(extractItems(response.data));
        }
      } catch (err) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : 'Error al cargar las tareas';
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialTasks();

    return () => {
      ignore = true;
    };
  }, [activeProjectId]);

  // Crear tarea (POST)
  const addTask = async (data: CreateTaskDTO) => {
    try {
      const response = await createTaskRequest(activeProjectId || data.projectId || '', data);
      setTasks((prev) => [response.data, ...prev]);
      toast.success('Tarea creada con éxito');
      return response.data;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al crear la tarea';
      toast.error(msg);
      throw err;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const currentTask = tasks.find((t) => t.id === id);
      const request = currentTask?.completed
        ? pendingTaskRequest(activeProjectId || currentTask.projectId || '', id)
        : completeTaskRequest(activeProjectId || currentTask?.projectId || '', id);
      const response = await request;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...response.data } : t))
      );
      if (!currentTask?.completed) {
        toast.success('¡Tarea completada!');
      } else {
        toast.info('Tarea marcada como pendiente');
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al cambiar estado';
      toast.error(msg);
    }
  };

  // Editar tarea (PUT / PATCH)
  const editTask = async (id: string, data: UpdateTaskDTO) => {
    try {
      const currentTask = tasks.find((t) => t.id === id);
      const response = await updateTaskRequest(
        activeProjectId || currentTask?.projectId || id,
        id,
        data
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...response.data } : t))
      );
      toast.success('Tarea actualizada correctamente');
      return response.data;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al actualizar tarea';
      toast.error(msg);
      throw err;
    }
  };

  // Eliminar tarea (DELETE)
  const removeTask = async (id: string) => {
    try {
      const currentTask = tasks.find((t) => t.id === id);
      await deleteTaskRequest(activeProjectId || currentTask?.projectId || id, id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Tarea eliminada del sistema');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al eliminar tarea';
      toast.error(msg);
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  };
}
