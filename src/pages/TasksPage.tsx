import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  getTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  completeTaskRequest,
  pendingTaskRequest,
  deleteTaskRequest,
  type Task,
  type CreateTaskDTO,
  type PaginationMeta,
} from '@/services/task.service';
import {
  getProjectsRequest,
  type Project,
} from '@/services/project.service';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskSkeleton } from '@/components/tasks/TaskSkeleton';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  Plus,
  RefreshCw,
  AlertCircle,
  Inbox,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlProjectId = searchParams.get('projectId') || '';

  // Proyectos
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(urlProjectId);

  // Tareas y paginación
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Cargar lista de proyectos
  useEffect(() => {
    let ignore = false;
    const loadProjects = async () => {
      try {
        const response = await getProjectsRequest();
        const list = response.data || [];
        if (!ignore) {
          setProjects(list);
          if (list.length > 0) {
            if (urlProjectId && list.some((p) => p.id === urlProjectId)) {
              setSelectedProjectId(urlProjectId);
            } else {
              setSelectedProjectId(list[0].id);
              setSearchParams({ projectId: list[0].id }, { replace: true });
            }
          } else {
            setSelectedProjectId('');
          }
        }
      } catch (err) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : 'Error al cargar proyectos';
          toast.error(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoadingProjects(false);
        }
      }
    };

    loadProjects();
    return () => {
      ignore = true;
    };
  }, [urlProjectId, setSearchParams]);

  // Recarga manual
  const fetchTasks = useCallback(
    async (projectIdToFetch: string, pageToFetch: number, limitToFetch: number) => {
      if (!projectIdToFetch) {
        setTasks([]);
        return;
      }

      setIsLoadingTasks(true);
      setTasksError(null);
      try {
        const response = await getTasksRequest(
          projectIdToFetch,
          pageToFetch,
          limitToFetch
        );
        const data = response.data;
        setTasks(data.items || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Error al cargar tareas paginadas';
        setTasksError(msg);
        toast.error(msg);
      } finally {
        setIsLoadingTasks(false);
      }
    },
    []
  );

  // Efecto cuando cambia proyecto, página o límite
  useEffect(() => {
    let ignore = false;
    const loadTasks = async () => {
      if (!selectedProjectId) {
        setTasks([]);
        return;
      }

      try {
        const response = await getTasksRequest(
          selectedProjectId,
          page,
          limit
        );
        if (!ignore) {
          const data = response.data;
          setTasks(data.items || []);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        }
      } catch (err) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : 'Error al cargar tareas paginadas';
          setTasksError(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoadingTasks(false);
        }
      }
    };

    loadTasks();
    return () => {
      ignore = true;
    };
  }, [selectedProjectId, page, limit]);

  // Manejar cambio de proyecto desde el selector
  const handleProjectChange = (newProjectId: string) => {
    setSelectedProjectId(newProjectId);
    setPage(1);
    setSearchParams({ projectId: newProjectId });
  };

  // Manejar cambio de límite por página
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Crear Tarea
  const handleAddTask = async (data: CreateTaskDTO) => {
    if (!selectedProjectId) {
      toast.error('Selecciona un proyecto antes de crear una tarea');
      return;
    }

    try {
      await createTaskRequest(selectedProjectId, data);
      toast.success('Tarea creada con éxito');
      await fetchTasks(selectedProjectId, page, limit);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear la tarea';
      toast.error(msg);
      throw err;
    }
  };

  // Alternar completado / pendiente
  const handleToggleTask = async (id: string) => {
    if (!selectedProjectId) return;
    try {
      const currentTask = tasks.find((t) => t.id === id);
      const isCompleted = currentTask?.completed;

      const request = isCompleted
        ? pendingTaskRequest(selectedProjectId, id)
        : completeTaskRequest(selectedProjectId, id);

      const response = await request;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...response.data } : t))
      );

      if (!isCompleted) {
        toast.success('¡Tarea completada!');
      } else {
        toast.info('Tarea marcada como pendiente');
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al alternar estado';
      toast.error(msg);
    }
  };

  // Editar Tarea
  const handleEditTask = async (id: string, data: CreateTaskDTO) => {
    if (!selectedProjectId) return;
    try {
      const response = await updateTaskRequest(selectedProjectId, id, data);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...response.data } : t))
      );
      toast.success('Tarea actualizada correctamente');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al actualizar tarea';
      toast.error(msg);
      throw err;
    }
  };

  // Eliminar Tarea
  const handleDeleteTask = async (id: string) => {
    if (!selectedProjectId) return;
    try {
      await deleteTaskRequest(selectedProjectId, id);
      toast.success('Tarea eliminada');
      if (tasks.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchTasks(selectedProjectId, page, limit);
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al eliminar tarea';
      toast.error(msg);
      throw err;
    }
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      {/* Cabecera y Controles Superiores */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Listado de Tareas
          </h1>
          <p className="text-sm text-slate-400">
            Tareas paginadas asociadas al proyecto seleccionado.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="default"
            onClick={() => fetchTasks(selectedProjectId, page, limit)}
            disabled={isLoadingTasks || !selectedProjectId}
            className="gap-2 border-slate-800 text-slate-300 hover:bg-slate-900"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoadingTasks ? 'animate-spin' : ''}`}
            />
            <span>Actualizar</span>
          </Button>

          <Button
            size="default"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!selectedProjectId}
            className="gap-2 bg-indigo-600 font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Tarea</span>
          </Button>
        </div>
      </div>

      {/* Barra de Proyecto y Opciones de Paginación */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Selector de Proyecto */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <label
              htmlFor="tasks-project-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Proyecto
            </label>
            <div className="mt-1 flex items-center gap-2">
              <select
                id="tasks-project-select"
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                disabled={isLoadingProjects || projects.length === 0}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm font-medium text-slate-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoadingProjects ? (
                  <option value="" disabled>
                    Cargando proyectos...
                  </option>
                ) : projects.length === 0 ? (
                  <option value="" disabled>
                    No hay proyectos registrados
                  </option>
                ) : (
                  projects.map((proj) => (
                    <option
                      key={proj.id}
                      value={proj.id}
                      className="bg-slate-900 text-slate-100"
                    >
                      {proj.name}
                    </option>
                  ))
                )}
              </select>

              {currentProject?.description && (
                <span className="hidden text-xs text-slate-400 md:inline max-w-sm truncate">
                  — {currentProject.description}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Selector de elementos por página */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Mostrar:</span>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
          </select>
        </div>
      </div>

      {/* Estados Visuales */}

      {/* 1. Sin proyectos */}
      {!isLoadingProjects && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
          <div className="rounded-full bg-slate-800/80 p-4 text-indigo-400">
            <FolderKanban className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-200">
            No tienes proyectos registrados
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            Para ver o registrar tareas necesitas al menos un proyecto.
          </p>
          <Link to="/projects">
            <Button className="mt-4 gap-2 bg-indigo-600 text-white hover:bg-indigo-500">
              <FolderPlus className="h-4 w-4" />
              <span>Ir a Proyectos y crear uno</span>
            </Button>
          </Link>
        </div>
      )}

      {/* 2. Cargando tareas */}
      {isLoadingTasks && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, index) => (
            <TaskSkeleton key={index} />
          ))}
        </div>
      )}

      {/* 3. Error */}
      {!isLoadingTasks && tasksError && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-rose-900/50 bg-rose-950/20 p-8 text-center">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <h3 className="mt-3 text-lg font-semibold text-rose-300">
            Error al obtener tareas
          </h3>
          <p className="mt-1 max-w-md text-sm text-rose-400/80">{tasksError}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTasks(selectedProjectId, page, limit)}
            className="mt-4 border-rose-800 text-rose-300 hover:bg-rose-950"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* 4. Lista vacía */}
      {!isLoadingTasks && !tasksError && projects.length > 0 && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
          <div className="rounded-full bg-slate-800/80 p-4 text-slate-400">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-200">
            No hay tareas en este proyecto
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            Comienza a registrar actividades o requerimientos usando el botón &quot;Nueva Tarea&quot;.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            <span>Crear primera tarea</span>
          </Button>
        </div>
      )}

      {/* 5. Lista de tareas paginadas */}
      {!isLoadingTasks && !tasksError && tasks.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={setTaskToEdit}
              />
            ))}
          </div>

          {/* Barra de Paginación */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 sm:flex-row">
            <div className="text-xs text-slate-400">
              Página <strong className="text-slate-200">{pagination.page}</strong> de{' '}
              <strong className="text-slate-200">{pagination.totalPages || 1}</strong>{' '}
              — Total: <strong className="text-slate-200">{pagination.totalItems}</strong>{' '}
              {pagination.totalItems === 1 ? 'tarea' : 'tareas'}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1 || isLoadingTasks}
                className="gap-1 border-slate-800 text-slate-300 hover:bg-slate-900 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (pNumber) => (
                    <Button
                      key={pNumber}
                      variant={pNumber === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pNumber)}
                      className={`h-8 w-8 p-0 text-xs ${
                        pNumber === page
                          ? 'bg-indigo-600 text-white'
                          : 'border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      {pNumber}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                }
                disabled={page >= pagination.totalPages || isLoadingTasks}
                className="gap-1 border-slate-800 text-slate-300 hover:bg-slate-900 disabled:opacity-40"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal de Creación */}
      <TaskForm
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleAddTask}
      />

      {/* Modal de Edición */}
      <TaskForm
        open={Boolean(taskToEdit)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setTaskToEdit(null);
        }}
        initialData={taskToEdit}
        onSubmit={async (data) => {
          if (taskToEdit) {
            await handleEditTask(taskToEdit.id, data);
          }
        }}
      />
    </div>
  );
}
