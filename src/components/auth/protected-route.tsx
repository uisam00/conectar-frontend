import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/services/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoaded } = useAuth();

  // Se ainda está carregando, mostrar loading
  if (!isLoaded) {
    return null;
  }

  // Se não está logado, redirecionar para login
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Se não há role específico requerido, permitir acesso
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Verificar se o usuário tem o role necessário
  const userRole = user.role?.name?.toLowerCase();
  const hasRequiredRole = userRole === requiredRole;

  if (!hasRequiredRole) {
    // Redirecionar usuários não-admin para home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
