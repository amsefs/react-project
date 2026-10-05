import { Link, NavLink, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckSquare, LogIn, UserPlus } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Navbar Superior Dinámica */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-white transition-all hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span>
              <span className="text-indigo-400">{APP_NAME}</span>
            </span>
          </Link>

          {/* Navegación y Botones de Acción */}
          <div className="flex items-center gap-3 sm:gap-4">
            <NavLink to="/login">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-1.5"
                >
                  <LogIn className="h-4 w-4" /> Iniciar Sesión
                </Button>
              )}
            </NavLink>
            <NavLink to="/register">
              <Button size="sm" className="gap-1.5 shadow-md">
                <UserPlus className="h-4 w-4" /> Registrarse
              </Button>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Contenido Dinámico de la Ruta Activa */}
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-8">
        <Outlet />
      </main>

      {/* Footer Compartido */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {APP_NAME} - Curso Didáctico de React
        </p>
      </footer>
    </div>
  );
}
