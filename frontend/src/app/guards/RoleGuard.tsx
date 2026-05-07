import React, { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { auth } = useAuth();
  
  if (!auth) return null;

  const hasAccess = allowedRoles.includes(auth.role.toLowerCase());

  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-red-50/30 rounded-[2.5rem] border border-red-100 border-dashed">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-gray-900 font-black text-2xl mb-2">Access Restricted</h2>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Your current account ({auth.role}) does not have sufficient permissions to view this content.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
};

// Helper component for conditional rendering within a page
export const HasRole: React.FC<{ allowedRoles: string[]; children: ReactNode }> = ({ allowedRoles, children }) => {
  const { auth } = useAuth();
  if (!auth || !allowedRoles.includes(auth.role.toLowerCase())) return null;
  return <>{children}</>;
};
