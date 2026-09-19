import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/features/auth/lib/auth-client";

export function ProtectedRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  // Si no hay sesión, redirigir al login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Si hay sesión, renderizar las rutas anidadas
  return <Outlet />;
}
