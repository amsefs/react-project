import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Estado para errores y feedback de carga
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejador dinámico de cambios en los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  // Manejador del envío y autenticación real con la API
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { email, password } = formData;

    // 1. Validar campos obligatorios
    if (!email.trim() || !password) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }

    // 2. Validar formato de correo
    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    // 3. Validar longitud mínima
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Petición real de inicio de sesión conectada a TaskFlow API
      await login({ email, password });
      // Redirección programática al Dashboard privado
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Credenciales inválidas o error de conexión con el servidor';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-8">
      <Card className="w-full max-w-lg border-slate-800 bg-slate-900/70 p-2 shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-slate-400">
            Ingresa a tu cuenta para gestionar tus tareas en TaskFlow
          </CardDescription>
        </CardHeader>

        {/* noValidate suprime los tooltips nativos del navegador */}
        <form noValidate onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Mensaje de Error Condicional */}
            {error && (
              <div className="animate-in fade-in flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Campo: Correo Electrónico */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
                <Input
                  name="email"
                  type="email"
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Campo: Contraseña */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Tu contraseña secreta"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>

          {/* Botón de envío con estado de carga */}
          <CardFooter className="mt-6 flex flex-col gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-indigo-600 font-semibold text-white shadow-md hover:bg-indigo-500"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                'Entrar a TaskFlow'
              )}
            </Button>

            <p className="text-center text-xs text-slate-400">
              ¿No tienes una cuenta aún?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-400 underline-offset-4 hover:underline"
              >
                Regístrate gratis
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
