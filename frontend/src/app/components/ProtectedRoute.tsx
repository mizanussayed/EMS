import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  auth: { role: string } | null;
  allowedRoles: string[];
}

export default function ProtectedRoute({ auth, allowedRoles }: ProtectedRouteProps) {
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
