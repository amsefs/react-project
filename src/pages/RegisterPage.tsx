import { useState } from 'react';
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
import { User, Mail, Lock, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const { name, email, password, confirmPassword } = formData;
    // 1. Validar campos obligatorios
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    // 2. Validar formato de email
    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    // 3. Validar longitud mínima
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    // 4. Validar coincidencia de contraseñas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      setIsSubmitting(true);
      // Petición real al backend enviando el DTO (sin confirmPassword)
      await register({ name, email, password });
      // Redirección al Dashboard tras el auto-login exitoso
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al registrar la cuenta. Intenta de nuevo.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-8">
      {/* Tarjeta más ancha (max-w-lg) y espaciosa */}
      <Card className="w-full max-w-lg border-slate-800 bg-slate-900/70 p-2 shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Crear una cuenta
          </CardTitle>
          <CardDescription className="text-slate-400">
            Ingresa tus datos para empezar a usar TaskFlow
          </CardDescription>
        </CardHeader>

        {/* noValidate suprime tooltips nativos del navegador */}
        <form noValidate onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="animate-in fade-in flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Campo: Nombre */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
                <Input
                  name="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Campo: Confirmar Contraseña */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>

          {/* CardFooter con mt-6 para dar respiro respecto al último input */}
          <CardFooter className="mt-6 flex flex-col gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-indigo-600 font-semibold text-white shadow-md hover:bg-indigo-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Registrarse'
              )}
            </Button>
            <p className="text-center text-xs text-slate-400">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-400 underline-offset-4 hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;
