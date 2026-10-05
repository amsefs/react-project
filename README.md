# ⚡ TaskFlow Frontend

Interfaz web moderna y de alto rendimiento para la gestión ágil de tareas personales y de equipo. Construida con **React 19**, **TypeScript**, **Vite** y estandarizada con **Tailwind CSS v4** y componentes accesibles.

---

## 🚀 Características Principales

- **🔐 Autenticación & Autorización:**
  - Registro de usuarios e inicio de sesión.
  - Gestión de sesión mediante tokens JWT con persistencia en `LocalStorage`.
  - Rutas públicas y rutas protegidas (`ProtectedRoute`).
  - Cierre de sesión seguro con limpieza de estado global.

- **📋 Gestión Completa de Tareas (CRUD):**
  - Creación rápida de tareas con título y descripción en modal interactivo.
  - Edición en caliente de tareas existentes.
  - Alternancia ágil de estado: pendiente ↔ completada.
  - Eliminación permanente de tareas.

- **📊 Métricas & Feedback Visual en Tiempo Real:**
  - Tarjetas de resumen en vivo: _Total de tareas_, _Completadas_ y _Pendientes_.
  - Notificaciones enriquecidas (_toasts_) con Sonner para cada acción del usuario.
  - Indicadores de carga mediante esqueletos animados (_Skeletons_).
  - Manejo integral de estados vacíos (_Empty state_) y estados de error con opción de reintento.

- **🎨 Diseño & Experiencia de Usuario (UX/UI):**
  - Interfaz oscura premium (_Dark Theme_) optimizada para desarrolladores.
  - Tipografía variable moderna (Geist).
  - Efectos visuales de desenfoque (_backdrop-blur_), bordes suaves y transiciones fluidas.
  - Totalmente adaptable a dispositivos móviles, tablets y escritorios.

---

## 🛠️ Stack Tecnológico

| Tecnología                                          | Rol / Descripción                                                            |
| :-------------------------------------------------- | :--------------------------------------------------------------------------- |
| **[React 19](https://react.dev/)**                  | Biblioteca principal de componentes de interfaz.                             |
| **[TypeScript](https://www.typescriptlang.org/)**   | Tipado estático robusto y autocompletado en toda la aplicación.              |
| **[Vite 8](https://vite.dev/)**                     | Entorno de desarrollo ultrarrápido y empaquetador para producción.           |
| **[Tailwind CSS v4](https://tailwindcss.com/)**     | Motor de estilos moderno y diseño basado en utilidades de última generación. |
| **[React Router DOM v7](https://reactrouter.com/)** | Enrutamiento declarativo del lado del cliente (SPA).                         |
| **[Lucide React](https://lucide.dev/)**             | Iconografía vectorizada clara y consistente.                                 |
| **[Sonner](https://sonner.emilkowal.ski/)**         | Sistema ligero y estilizado de alertas y notificaciones Toast.               |
| **[@base-ui/react](https://base-ui.com/) / Shadcn** | Primitivas y componentes UI accesibles y sin estilos restrictivos.           |

---

## 📁 Estructura del Proyecto

```text
src/
├── assets/             # Recursos estáticos (imágenes, SVGs)
├── components/         # Componentes reutilizables
│   ├── common/         # Componentes comunes (p. ej. ProtectedRoute)
│   ├── tasks/          # Componentes de tareas (TaskItem, TaskForm, TaskSkeleton)
│   └── ui/             # Primitivas de diseño (Button, Card, Dialog, Input, etc.)
├── context/            # Contexto global de la aplicación (AuthContext, AuthProvider)
├── hooks/              # Custom hooks (useAuth, useTasks)
├── layouts/            # Estructuras de página compartidas (MainLayout)
├── lib/                # Utilidades generales y constantes globales
├── pages/              # Vistas principales de la aplicación
│   ├── LandingPage.tsx   # Página de inicio con hero y características
│   ├── LoginPage.tsx     # Formulario de inicio de sesión
│   ├── RegisterPage.tsx  # Formulario de registro de usuarios
│   └── DashboardPage.tsx # Panel privado con métricas y lista de tareas
├── services/           # Capa de consumo de API REST
│   ├── api.ts            # Cliente fetch centralizado con inyección de JWT
│   ├── auth.service.ts   # Peticiones de autenticación
│   └── task.service.ts   # Peticiones CRUD de tareas
├── App.tsx             # Configuración de rutas y providers globales
└── main.tsx            # Punto de entrada de la aplicación
```

---

## ⚙️ Configuración del Entorno

1. Clona el repositorio y sitúate en el directorio del proyecto:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd taskflow-front
   ```

2. Copia la plantilla de variables de entorno:

   ```bash
   cp .env.example .env
   ```

3. Modifica los valores en el archivo `.env` según tu entorno:

| Variable         | Descripción                                                | Valor por defecto       |
| :--------------- | :--------------------------------------------------------- | :---------------------- |
| `VITE_API_URL`   | URL base del backend (API REST de TaskFlow)                | `http://localhost:3000` |
| `VITE_TOKEN_KEY` | Nombre de la clave para almacenar el JWT en `localStorage` | `taskflow_token`        |
| `VITE_APP_NAME`  | Nombre visible de la aplicación en la interfaz             | `TaskFlow`              |

---

## 💻 Instalación y Ejecución

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible típicamente en [http://localhost:5173](http://localhost:5173).

### 3. Compilar para producción

```bash
npm run build
```

Genera el paquete optimizado en el directorio `dist/`.

### 4. Previsualizar el build de producción localmente

```bash
npm run preview
```

### 5. Verificar linters de código

```bash
npm run lint
```

---

## 🔗 Endpoints Consumidos (Backend)

La aplicación espera comunicarse con un backend que exponga los siguientes endpoints bajo `VITE_API_URL`:

- **Autenticación:**
  - `POST /auth/register` - Registro de usuario (`name`, `email`, `password`).
  - `POST /auth/login` - Inicio de sesión (`email`, `password`) -> devuelve token JWT.
  - `GET /auth/me` - Perfil del usuario autenticado con cabecera `Authorization: Bearer <token>`.

- **Tareas:**
  - `GET /tasks` - Obtener lista de tareas del usuario autenticado.
  - `POST /tasks` - Crear una tarea (`title`, `description`).
  - `PUT /tasks/:id` - Actualizar título o descripción de una tarea existente.
  - `PATCH /tasks/:id/complete` - Marcar tarea como completada.
  - `PATCH /tasks/:id/pending` - Marcar tarea como pendiente.
  - `DELETE /tasks/:id` - Eliminar tarea.

---

## 📄 Licencia

Este proyecto está distribuido bajo licencia privada o para fines educativos y de demostración técnica.
