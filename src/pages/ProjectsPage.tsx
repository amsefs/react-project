import { useState, useEffect, useCallback, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProjectsRequest,
  createProjectRequest,
  updateProjectRequest,
  deleteProjectRequest,
  type Project,
  type CreateProjectDTO,
  type UpdateProjectDTO,
} from '@/services/project.service';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FolderKanban,
  FolderPlus,
  Plus,
  RefreshCw,
  AlertCircle,
  Pencil,
  Trash2,
  ListTodo,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modal de Creación/Edición de Proyecto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para modal de Eliminación
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar proyectos desde el backend
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProjectsRequest();
      setProjects(response.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar los proyectos';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial asíncrona segura para evitar cascading renders
  useEffect(() => {
    let ignore = false;
    const loadInitial = async () => {
      try {
        const response = await getProjectsRequest();
        if (!ignore) {
          setProjects(response.data || []);
        }
      } catch (err) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Error al cargar los proyectos';
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  // Abrir modal de creación
  const handleOpenCreate = () => {
    setProjectToEdit(null);
    setName('');
    setDescription('');
    setStatus('active');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Abrir modal de edición
  const handleOpenEdit = (project: Project) => {
    setProjectToEdit(project);
    setName(project.name);
    setDescription(project.description || '');
    setStatus(project.status || 'active');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Guardar proyecto (Crear o Actualizar)
  const handleSubmitProject = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('El nombre del proyecto es obligatorio.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (projectToEdit) {
        const updateData: UpdateProjectDTO = {
          name: name.trim(),
          description: description.trim(),
          status,
        };
        const res = await updateProjectRequest(projectToEdit.id, updateData);
        setProjects((prev) =>
          prev.map((p) => (p.id === projectToEdit.id ? { ...p, ...res.data } : p))
        );
        toast.success('Proyecto actualizado con éxito');
      } else {
        const createData: CreateProjectDTO = {
          name: name.trim(),
          description: description.trim(),
        };
        const res = await createProjectRequest(createData);
        setProjects((prev) => [res.data, ...prev]);
        toast.success('Proyecto creado con éxito');
      }
      setIsModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el proyecto';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar proyecto
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProjectRequest(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      toast.success('Proyecto eliminado');
      setProjectToDelete(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar el proyecto';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de la sección */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Proyectos</h1>
          <p className="text-sm text-slate-400">
            Administra tus proyectos de trabajo y accede a sus tareas específicas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={fetchProjects}
            disabled={isLoading}
            className="gap-2 border-slate-800 text-slate-300 hover:bg-slate-900"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>

          <Button
            size="default"
            onClick={handleOpenCreate}
            className="gap-2 bg-indigo-600 font-semibold text-white shadow-md hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Proyecto</span>
          </Button>
        </div>
      </div>

      {/* Estados de Carga */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-slate-800 bg-slate-900/60 p-5">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-9 w-full" />
            </Card>
          ))}
        </div>
      )}

      {/* Estado de Error */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-rose-900/50 bg-rose-950/20 p-8 text-center">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <h3 className="mt-3 text-lg font-semibold text-rose-300">Error al cargar proyectos</h3>
          <p className="mt-1 max-w-md text-sm text-rose-400/80">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProjects}
            className="mt-4 border-rose-800 text-rose-300 hover:bg-rose-950"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Estado Vacío */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
          <div className="rounded-full bg-slate-800/80 p-4 text-indigo-400">
            <FolderKanban className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-200">
            Aún no tienes proyectos registrados
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            Crea tu primer proyecto para empezar a estructurar y gestionar tus tareas.
          </p>
          <Button
            onClick={handleOpenCreate}
            className="mt-4 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Crear mi primer proyecto</span>
          </Button>
        </div>
      )}

      {/* Grilla de Proyectos */}
      {!isLoading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col justify-between border-slate-800 bg-slate-900/80 transition-all hover:border-slate-700/80 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-semibold text-white">
                      {project.name}
                    </CardTitle>
                  </div>

                  <Badge
                    variant={project.status === 'completed' ? 'default' : 'secondary'}
                    className="capitalize text-xs"
                  >
                    {project.status || 'Activo'}
                  </Badge>
                </div>

                <CardDescription className="pt-2 text-sm text-slate-400 line-clamp-3">
                  {project.description || 'Sin descripción proporcionada.'}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex items-center justify-between border-t border-slate-800/60 bg-slate-900/40 px-4 py-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/tasks?projectId=${project.id}`)}
                  className="gap-1.5 text-xs text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                >
                  <ListTodo className="h-3.5 w-3.5" />
                  <span>Ver Tareas</span>
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(project)}
                    className="h-8 px-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    title="Editar proyecto"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProjectToDelete(project)}
                    className="h-8 px-2 text-xs text-slate-400 hover:bg-rose-950/40 hover:text-rose-400"
                    title="Eliminar proyecto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Creación / Edición */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-indigo-400">
              {projectToEdit ? (
                <Pencil className="h-5 w-5" />
              ) : (
                <FolderPlus className="h-5 w-5" />
              )}
              <DialogTitle className="text-lg font-bold text-white">
                {projectToEdit ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-400">
              {projectToEdit
                ? 'Actualiza el nombre, descripción o estado de este proyecto.'
                : 'Ingresa los datos para registrar tu nuevo proyecto.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitProject} className="space-y-4 pt-2">
            {formError && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-900/50 bg-rose-950/30 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Nombre del Proyecto <span className="text-rose-400">*</span>
              </label>
              <Input
                type="text"
                placeholder="Ej. Rediseño Web, App Móvil..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formError) setFormError(null);
                }}
                disabled={isSubmitting}
                className="bg-slate-950/50 text-slate-100 focus-visible:border-indigo-500"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Descripción <span className="text-slate-500">(opcional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Detalles sobre los objetivos o entregables..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="flex w-full rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {projectToEdit && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isSubmitting}
                  className="flex h-9 w-full rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-1 text-sm text-slate-100 shadow-sm focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
            )}

            <DialogFooter className="gap-3 pt-3 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 font-medium text-white hover:bg-indigo-500"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>{projectToEdit ? 'Guardar Cambios' : 'Crear Proyecto'}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => {
          if (!open) setProjectToDelete(null);
        }}
      >
        <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold text-white">
                ¿Eliminar proyecto?
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-400">
              Esta acción dará de baja el proyecto:
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-200">
              {projectToDelete?.name}
            </p>
            {projectToDelete?.description && (
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                {projectToDelete.description}
              </p>
            )}
          </div>

          <DialogFooter className="gap-3 pt-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setProjectToDelete(null)}
              disabled={isDeleting}
              className="border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className="gap-2 bg-rose-600 font-medium text-white hover:bg-rose-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar Proyecto</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
