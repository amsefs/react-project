import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Clock,
  ListTodo,
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

function LandingPage() {
  return (
    <div className="flex flex-col gap-24 py-8">
      {/* 1. SECCIÓN HERO */}
      <section className="mx-auto flex max-w-4xl flex-col items-center space-y-8 pt-6 text-center">
        {/* Badge Novedad */}
        <Badge
          variant="outline"
          className="gap-1.5 border-indigo-500/40 bg-indigo-950/40 px-3 py-1 text-xs text-indigo-300"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          {APP_NAME} v1.0
        </Badge>

        {/* Título Principal con Gradiente */}
        <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl">
          Gestiona tus tareas diarias con{' '}
          <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            máxima fluidez
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
          Diseñado para desarrolladores y equipos ágiles. Organiza tus
          proyectos, prioriza entregables y aumenta tu productividad sin
          fricción.
        </p>

        {/* Botones de Llamada a la Acción (CTA) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/register">
            <Button
              size="lg"
              className="gap-2 bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500"
            >
              Empezar Gratis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-800 text-slate-200 hover:bg-slate-900"
            >
              Ver Demostración
            </Button>
          </Link>
        </div>

        {/* Mockup / Previsualización interactiva de Tareas */}
        <div className="w-full max-w-xl pt-6">
          <Card className="border-slate-800 bg-slate-900/60 text-left shadow-2xl backdrop-blur-md">
            <CardHeader className="border-b border-slate-800/80 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-400">
                    Mis Tareas de Hoy
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 text-xs text-emerald-400"
                >
                  <CheckCircle2 className="h-3 w-3" /> 2 / 3 Completadas
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 p-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm text-slate-500 line-through">
                    Configurar frontend con Tailwind y shadcn
                  </span>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Listo
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm text-slate-500 line-through">
                    Definir arquitectura de rutas con React Router
                  </span>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Listo
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-indigo-500/30 bg-indigo-950/20 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded border border-indigo-500/60 text-indigo-400">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    Crear formularios de autenticación
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-indigo-500/50 text-[10px] text-indigo-300"
                >
                  En progreso
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. SECCIÓN DE CARACTERÍSTICAS (FEATURES) */}
      <section className="space-y-12">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Todo lo que necesitas para ser productivo
          </h2>
          <p className="mx-auto max-w-xl text-sm text-slate-400 sm:text-base">
            Diseñado pensando en la agilidad de los desarrolladores modernos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/40 transition-all hover:-translate-y-1 hover:border-slate-700">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-white">
                Velocidad Instantánea
              </CardTitle>
              <CardDescription className="text-sm text-slate-400">
                Navegación SPA instantánea con Vite y React Router. Sin recargas
                ni esperas innecesarias.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/40 transition-all hover:-translate-y-1 hover:border-slate-700">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-white">
                Autenticación Segura
              </CardTitle>
              <CardDescription className="text-sm text-slate-400">
                Protección de rutas con JWT Tokens. Tus tareas son privadas y
                solo accesibles por tu usuario.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/40 transition-all hover:-translate-y-1 hover:border-slate-700">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600/20 text-pink-400">
                <ListTodo className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-white">
                Gestión Completa (CRUD)
              </CardTitle>
              <CardDescription className="text-sm text-slate-400">
                Crea, actualiza, completa y elimina tus tareas fácilmente con
                confirmación y feedback visual.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 3. SECCIÓN CÓMO FUNCIONA & CTA FINAL */}
      <section className="space-y-8 rounded-3xl border border-indigo-900/50 bg-linear-to-b from-indigo-950/40 to-slate-900/60 p-8 text-center sm:p-12">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          ¿Listo para poner orden en tus proyectos?
        </h2>
        <p className="mx-auto max-w-xl text-base text-slate-300">
          Crea tu cuenta en menos de un minuto y empieza a organizar tus tareas
          hoy mismo.
        </p>
        <div>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-indigo-600 px-8 font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500"
            >
              Crear mi cuenta gratis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
