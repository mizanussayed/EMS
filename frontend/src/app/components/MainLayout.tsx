import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  auth: {
    accessToken: string;
    role: string;
    userName: string;
  };
  onLogout: () => void;
}

export default function MainLayout({ auth, onLogout }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onLogout={onLogout}
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
