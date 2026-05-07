import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function MainLayout() {
  const { auth, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!auth) return null;

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onLogout={logout}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            role={auth.role}
            userName={auth.userName}
          />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
        </main>
      </div>
    </div>
  );
}
