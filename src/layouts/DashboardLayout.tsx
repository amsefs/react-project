import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  CheckSquare,
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Proyectos', icon: FolderKanban },
  { to: '/tasks', label: 'Tareas', icon: ListTodo },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Barra de navegación superior privada */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Logo y Menú Principal */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-xl font-bold text-white transition-opacity hover:opacity-90"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
                <CheckSquare className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline">
                {APP_NAME.slice(0, 4)}
                <span className="text-indigo-400">{APP_NAME.slice(4) || 'Flow'}</span>
              </span>
            </Link>

            {/* Menú de Navegación entre Dashboard, Proyectos y Tareas */}
            <nav className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Perfil del usuario y botón de cerrar sesión */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden text-right md:block">
              <div className="flex items-center justify-end gap-1.5 text-sm font-medium text-slate-200">
                <UserIcon className="h-3.5 w-3.5 text-indigo-400" />
                <span>{user?.name || 'Usuario'}</span>
              </div>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido principal de la página activa */}
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-8">
        <Outlet />
      </main>

      {/* Footer privado */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {APP_NAME} - Panel de Administración</p>
      </footer>
    </div>
  );
}
