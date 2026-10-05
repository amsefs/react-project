import { useState, type SubmitEvent } from 'react';
import type { Task, CreateTaskDTO } from '@/services/task.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertCircle, Loader2, PlusCircle, Pencil } from 'lucide-react';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTaskDTO) => Promise<unknown>;
  initialData?: Task | null;
}

interface TaskFormContentProps {
  initialData?: Task | null;
  onSubmit: (data: CreateTaskDTO) => Promise<unknown>;
  onClose: () => void;
}

/**
 * Componente interno que administra los campos y el ciclo de vida del formulario.
 * Al recibir una `key` única desde el componente padre, React reinicia su estado
 * automáticamente sin necesidad de efectos secundarios (cero cascading renders).
 */
function TaskFormContent({
  initialData,
  onSubmit,
  onClose,
}: TaskFormContentProps) {
  const isEditing = Boolean(initialData);

  // Inicialización directa basada en las props recibidas en el montaje
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(
    initialData?.description ?? ''
  );

  // Feedback y envío
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Envío del formulario
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('El título de la tarea es obligatorio.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al procesar la solicitud en el servidor';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 text-indigo-400">
          {isEditing ? (
            <Pencil className="h-5 w-5" />
          ) : (
            <PlusCircle className="h-5 w-5" />
          )}
          <DialogTitle className="text-lg font-bold text-white">
            {isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}
          </DialogTitle>
        </div>
        <DialogDescription className="text-xs text-slate-400">
          {isEditing
            ? 'Modifica los datos necesarios y guarda los cambios.'
            : 'Ingresa un título descriptivo y detalles adicionales para tu tarea.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Alerta de Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-900/50 bg-rose-950/30 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Campo: Título */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">
            Título <span className="text-rose-400">*</span>
          </label>
          <Input
            type="text"
            placeholder="Ej. Revisar balance mensual..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            disabled={isSubmitting}
            className="bg-slate-950/50 text-slate-100 focus-visible:border-indigo-500"
            autoFocus
          />
        </div>

        {/* Campo: Descripción */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">
            Descripción <span className="text-slate-500">(opcional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Detalles, notas o pasos a seguir..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            className="flex w-full rounded-lg border bg-slate-950/50 px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Botones de Acción con separación homogénea */}
        <DialogFooter className="gap-3 pt-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
                {isEditing ? 'Guardando...' : 'Creando...'}
              </>
            ) : (
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Tarea'}</span>
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

/**
 * Modal principal exportado.
 * Encapsula el contenedor Dialog y delega el contenido a TaskFormContent con una clave única.
 */
export function TaskForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: TaskFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-md">
        <TaskFormContent
          key={initialData ? initialData.id : open ? 'new-open' : 'closed'}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
