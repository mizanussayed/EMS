import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Subjects from './pages/Subjects';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Results from './pages/Results';
import Timetable from './pages/Timetable';
import Fees from './pages/Fees';
import Library from './pages/Library';
import Events from './pages/Events';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

interface MainLayoutProps {
  auth: {
    accessToken: string;
    role: string;
    userName: string;
  };
  onLogout: () => void;
}

export default function MainLayout({ auth, onLogout }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'students':
        return <Students token={auth.accessToken} />;
      case 'teachers':
        return <Teachers />;
      case 'classes':
        return <Classes />;
      case 'subjects':
        return <Subjects />;
      case 'attendance':
        return <Attendance token={auth.accessToken} />;
      case 'exams':
        return <Exams />;
      case 'results':
        return <Results />;
      case 'timetable':
        return <Timetable />;
      case 'fees':
        return <Fees />;
      case 'library':
        return <Library />;
      case 'events':
        return <Events />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          role={auth.role}
          userName={auth.userName}
        />
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
