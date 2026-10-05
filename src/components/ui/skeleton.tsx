import * as React from 'react';
import { cn } from 'cn';

/**
 * Componente Skeleton de shadcn/ui:
 * Crea bloques rectangulares o redondeados con la animación nativa `animate-pulse`
 * para simular texto, avatares o tarjetas mientras se cargan los datos.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-800/60', className)}
      {...props}
    />
  );
}

export { Skeleton };
