import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(auth.role.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
