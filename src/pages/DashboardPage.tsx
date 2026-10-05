import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  getProjectsRequest,
  type Project,
} from '@/services/project.service';
import {
  getTasksRequest,
  type Task,
  completeTaskRequest,
  pendingTaskRequest,
} from '@/services/task.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasksCount, setTotalTasksCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carga manual desde el botón Actualizar
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const projRes = await getProjectsRequest();
      const projList = projRes.data || [];
      setProjects(projList);

      const activeProjId = selectedProjectId || (projList.length > 0 ? projList[0].id : '');
      if (activeProjId) {
        if (!selectedProjectId) setSelectedProjectId(activeProjId);
        const tasksRes = await getTasksRequest(activeProjId, 1, 5);
        setTasks(tasksRes.data.items || []);
        setTotalTasksCount(tasksRes.data.pagination?.totalItems || 0);
      } else {
        setTasks([]);
        setTotalTasksCount(0);
      }
      toast.success('Panel actualizado');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar datos';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Carga reactiva segura en useEffect
  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      try {
        const projRes = await getProjectsRequest();
        if (ignore) return;
        const projList = projRes.data || [];
        setProjects(projList);

        const activeProjId = selectedProjectId || (projList.length > 0 ? projList[0].id : '');
        if (activeProjId) {
          if (!selectedProjectId) setSelectedProjectId(activeProjId);
          const tasksRes = await getTasksRequest(activeProjId, 1, 5);
          if (!ignore) {
            setTasks(tasksRes.data.items || []);
            setTotalTasksCount(tasksRes.data.pagination?.totalItems || 0);
          }
        } else {
          if (!ignore) {
            setTasks([]);
            setTotalTasksCount(0);
          }
        }
      } catch (err) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Error al cargar datos del panel';
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      ignore = true;
    };
  }, [selectedProjectId]);

  // Alternar estado de una tarea directamente desde el dashboard
  const handleToggleTask = async (task: Task) => {
    if (!selectedProjectId) return;
    try {
      const req = task.completed
        ? pendingTaskRequest(selectedProjectId, task.id)
        : completeTaskRequest(selectedProjectId, task.id);
      const res = await req;
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, ...res.data } : t))
      );
      toast.success(task.completed ? 'Tarea pendiente' : '¡Tarea completada!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar tarea';
      toast.error(msg);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const activeProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-8">
      {/* Saludo y Cabecera del Dashboard */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            ¡Hola, {user?.name || 'Bienvenido'}!
          </h1>
          <p className="text-sm text-slate-400">
            Resumen global de tus proyectos activos y actividades prioritarias.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2 border-slate-800 text-slate-300 hover:bg-slate-900"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>

          <Link to="/tasks">
            <Button className="gap-2 bg-indigo-600 font-semibold text-white shadow-md hover:bg-indigo-500">
              <ListTodo className="h-4 w-4" />
              <span>Ver Tareas Paginadas</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Alerta de Error si ocurre */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Métrica 1: Proyectos */}
        <Card className="border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700/80">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                Proyectos
              </p>
              {isLoading ? (
                <Skeleton className="mt-1 h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-slate-100">{projects.length}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Métrica 2: Total Tareas del Proyecto */}
        <Card className="border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700/80">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-sky-500/10 p-3 text-sky-400">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                Total Tareas
              </p>
              {isLoading ? (
                <Skeleton className="mt-1 h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-slate-100">{totalTasksCount}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Métrica 3: Completadas (Muestra actual) */}
        <Card className="border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700/80">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                Completadas
              </p>
              {isLoading ? (
                <Skeleton className="mt-1 h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Métrica 4: Pendientes (Muestra actual) */}
        <Card className="border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700/80">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-amber-500/10 p-3 text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                Pendientes
              </p>
              {isLoading ? (
                <Skeleton className="mt-1 h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos Rápidos y Selector de Proyecto */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna Izquierda: Vista previa de Tareas del proyecto activo */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Proyecto en foco
              </h2>
              <p className="text-xs text-slate-400">
                Selecciona un proyecto para inspeccionar sus tareas prioritarias.
              </p>
            </div>

            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={isLoading || projects.length === 0}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs sm:text-sm text-slate-100 shadow-sm focus:border-indigo-500 focus:outline-none"
            >
              {projects.length === 0 ? (
                <option value="" disabled>
                  No hay proyectos
                </option>
              ) : (
                projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Lista previa de tareas */}
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  Tareas de &quot;{activeProject?.name || 'este proyecto'}&quot;
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Mostrando las primeras tareas registradas.
                </CardDescription>
              </div>

              {selectedProjectId && (
                <Link to={`/tasks?projectId=${selectedProjectId}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                  >
                    <span>Ver paginadas</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </CardHeader>

            <CardContent>
              {isLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )}

              {!isLoading && tasks.length === 0 && (
                <div className="py-8 text-center">
                  <Inbox className="mx-auto h-8 w-8 text-slate-500" />
                  <p className="mt-2 text-sm text-slate-400">
                    No hay tareas en este proyecto aún.
                  </p>
                  <Link to={`/tasks?projectId=${selectedProjectId}`}>
                    <Button size="sm" className="mt-3 gap-1.5 bg-indigo-600 text-white">
                      <ListTodo className="h-3.5 w-3.5" />
                      <span>Crear Tarea en Tareas</span>
                    </Button>
                  </Link>
                </div>
              )}

              {!isLoading && tasks.length > 0 && (
                <div className="divide-y divide-slate-800">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between py-3 transition-colors hover:bg-slate-800/30 px-2 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task)}
                          className="shrink-0 text-slate-400 transition-colors hover:text-indigo-400"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-400" />
                          )}
                        </button>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              task.completed
                                ? 'text-slate-400 line-through'
                                : 'text-slate-200'
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant={task.completed ? 'default' : 'secondary'}
                        className="text-[11px]"
                      >
                        {task.completed ? 'Completada' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Tarjetas de Navegación y Acciones directas */}
        <div className="space-y-4">
          {/* Card Proyectos */}
          <Card className="border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                <FolderKanban className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Módulo de Proyectos</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Crea nuevos proyectos, modifica sus estados y organízalos eficazmente.
            </p>
            <Link to="/projects">
              <Button variant="outline" size="sm" className="w-full gap-2 border-slate-700 text-slate-200 hover:bg-slate-800">
                <span>Ir al listado de proyectos</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* Card Tareas Paginadas */}
          <Card className="border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                <ListTodo className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Tareas Paginadas</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Visualiza y administra tus tareas con paginación integrada (página, límite y filtros).
            </p>
            <Link to="/tasks">
              <Button size="sm" className="w-full gap-2 bg-indigo-600 text-white hover:bg-indigo-500">
                <span>Ir al listado paginado</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
