import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  FileText,
  Calendar,
  DollarSign,
  Library,
  CalendarDays,
  BarChart3,
  Settings,
  School,
  Settings2,
  ChevronDown,
  ChevronRight,
  Clock,
  Award,
  Layers,
  Map
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    academic: false,
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, page: '/dashboard' },
    { id: 'students', label: 'Students', icon: Users, page: '/students' },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, page: '/teachers' },
    { 
      id: 'academic', 
      label: 'Academic Settings', 
      icon: Settings2,
      isGroup: true,
      children: [
        { id: 'shifts', label: 'Shifts', icon: Clock, page: '/shifts' },
        { id: 'badges', label: 'Student Badges', icon: Award, page: '/badges' },
        { id: 'classes', label: 'Classes', icon: School, page: '/classes' },
        { id: 'subjects', label: 'Subjects', icon: BookOpen, page: '/subjects' },
        { id: 'timetable', label: 'Timetable', icon: Calendar, page: '/timetable' },
      ]
    },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList, page: '/attendance' },
    { id: 'exams', label: 'Exams', icon: FileText, page: '/exams' },
    { id: 'results', label: 'Results', icon: BarChart3, page: '/results' },
    { id: 'fees', label: 'Fees & Payments', icon: DollarSign, page: '/fees' },
    { id: 'library', label: 'Library', icon: Library, page: '/library' },
    { id: 'events', label: 'Events', icon: CalendarDays, page: '/events' },
    { id: 'reports', label: 'Reports', icon: BarChart3, page: '/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, page: '/settings' },
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-white shadow-lg overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#2D6CDF] rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">EMS</h2>
            <p className="text-xs text-gray-500">Education Portal</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            if (item.isGroup) {
              const isExpanded = expandedGroups[item.id];
              const hasActiveChild = item.children?.some(child => location.pathname === child.page);
              
              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => toggleGroup(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                      hasActiveChild ? 'bg-blue-50 text-[#2D6CDF]' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = location.pathname === child.page;
                        
                        return (
                          <button
                            key={child.id}
                            onClick={() => navigate(child.page)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                              isChildActive
                                ? 'bg-[#2D6CDF] text-white shadow-md shadow-[#2D6CDF]/20'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <ChildIcon className="w-4 h-4" />
                            <span className="text-sm">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = location.pathname === item.page;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.page!)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#2D6CDF] text-white shadow-md shadow-[#2D6CDF]/20'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
