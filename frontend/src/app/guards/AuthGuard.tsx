import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/auth.store';

interface AuthGuardProps {
  allowedRoles?: string[];
  children?: ReactNode;
}

export default function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const location = useLocation();
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(session.role.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
}