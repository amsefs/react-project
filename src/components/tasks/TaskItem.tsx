import { useState } from 'react';
import type { Task } from '@/services/task.service';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Trash2,
  Circle,
  AlertTriangle,
  Loader2,
  Pencil,
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<unknown>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<unknown>;
}

/**
 * Componente que representa una tarjeta de tarea interactiva:
 * Permite alternar su estado (PATCH) o eliminarla con confirmación visual (DELETE).
 */
export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  // Estados locales para feedback de carga y control del modal
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Formatear la fecha de creación si está disponible
  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  // Manejar el toggle (completar / pendiente)
  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggle(task.id);
    } catch (err) {
      console.error('Error al alternar estado de la tarea:', err);
    } finally {
      setIsToggling(false);
    }
  };

  // Manejar la eliminación definitiva
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(task.id);
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error al eliminar la tarea:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        className={`group flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700/80 hover:shadow-lg hover:shadow-indigo-500/5 active:scale-[0.99] ${
          task.completed
            ? 'border-slate-800/80 bg-slate-900/40 opacity-80'
            : 'border-slate-800 bg-slate-900/90'
        }`}
      >
        <CardHeader className="gap-2 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {/* Botón circular de alternar estado */}
              <button
                type="button"
                onClick={handleToggle}
                disabled={isToggling}
                className="mt-0.5 shrink-0 text-slate-400 transition-colors hover:text-indigo-400 focus:outline-none disabled:opacity-50"
                title={
                  task.completed
                    ? 'Marcar como pendiente'
                    : 'Marcar como completada'
                }
              >
                {isToggling ? (
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                ) : task.completed ? (
                  <CheckCircle2 className="h-5 w-5 fill-emerald-500/20 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 hover:text-indigo-400" />
                )}
              </button>

              <CardTitle
                className={`text-base leading-snug font-semibold transition-all ${
                  task.completed
                    ? 'text-slate-400 line-through'
                    : 'text-slate-100'
                }`}
              >
                {task.title}
              </CardTitle>
            </div>

            {/* Badge dinámico */}
            {task.completed ? (
              <Badge
                variant="default"
                className="shrink-0 gap-1 bg-emerald-600/90 text-xs text-white hover:bg-emerald-600"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Completada</span>
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="shrink-0 gap-1 text-xs text-slate-300"
              >
                <Clock className="h-3 w-3 text-amber-400" />
                <span>Pendiente</span>
              </Badge>
            )}
          </div>

          {task.description && (
            <CardDescription className="pl-7 text-sm text-slate-400">
              {task.description}
            </CardDescription>
          )}
        </CardHeader>

        {/* Pie de la tarjeta: Fecha y Botones de Acción */}
        <CardFooter className="flex items-center justify-between border-t border-slate-800/60 bg-slate-900/30 px-4 py-2.5">
          {formattedDate ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-1">
            {/* Botón Editar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 gap-1.5 px-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-indigo-400"
              title="Editar tarea"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Editar</span>
            </Button>

            {/* Botón Eliminar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-8 gap-1.5 px-2 text-xs text-slate-400 hover:bg-rose-950/40 hover:text-rose-400"
              title="Eliminar tarea"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Eliminar</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold text-white">
                ¿Eliminar tarea?
              </DialogTitle>
            </div>
            <DialogDescription className="pt-1 text-xs text-slate-400">
              Esta acción es irreversible y no se puede deshacer. Se eliminará
              la siguiente tarea:
            </DialogDescription>
          </DialogHeader>

          {/* Tarjeta de previsualización del ítem a borrar */}
          <div className="my-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-200">{task.title}</p>
            {task.description && (
              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {task.description}
              </p>
            )}
          </div>

          {/* Pie de modal con separación adecuada entre Cancelar y Eliminar */}
          <DialogFooter className="gap-3 pt-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
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
                  <span>Eliminar definitivamente</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
