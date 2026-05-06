import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/auth.store';

interface GuestGuardProps {
  children?: ReactNode;
}

const roleHome: Record<string, string> = {
  admin: '/dashboard',
  teacher: '/teacher',
  student: '/dashboard',
  accountant: '/dashboard',
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const session = useAuthStore((state) => state.session);

  if (session) {
    return <Navigate to={roleHome[session.role.toLowerCase()] ?? '/dashboard'} replace />;
  }

  return children ?? <Outlet />;
}