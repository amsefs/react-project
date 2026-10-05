import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Componente que proyecta la silueta visual de una tarjeta de tarea.
 * Evita el salto brusco de maquetación (CLS) durante la carga inicial de datos.
 */
export function TaskSkeleton() {
  return (
    <Card className="flex flex-col justify-between border-slate-800 bg-slate-900/60">
      <CardHeader className="gap-2 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 items-start gap-2.5">
            {/* Silueta del botón circular de alternar estado */}
            <Skeleton className="h-5 w-5 shrink-0 rounded-full" />

            {/* Silueta del título y subtítulo */}
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>

          {/* Silueta del Badge de estado */}
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>

      {/* Silueta de la descripción */}
      <CardContent className="space-y-2 py-2">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </CardContent>

      {/* Silueta del pie de tarjeta: fecha y botones de acción */}
      <CardFooter className="flex items-center justify-between border-t border-slate-800/60 bg-slate-900/30 px-4 py-2.5">
        <Skeleton className="h-3 w-28 rounded" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}
