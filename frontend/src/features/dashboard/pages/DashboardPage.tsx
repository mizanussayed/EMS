import {
  Users,
  GraduationCap,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Search,
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { StatCard } from '@/app/components/ui/StatCard';
import { useDashboardSummary } from '../hooks/useDashboardSummary';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading, error } = useDashboardSummary();

  const attendanceRate = useMemo(() => {
    if (!summary || summary.attendanceCount === 0) {
      return 0;
    }

    return (summary.presentCount / summary.attendanceCount) * 100;
  }, [summary]);

  const kpis = [
    { label: 'Students', value: summary?.studentCount ?? 0, icon: Users, color: 'blue' as const, trend: '+12% this month' },
    { label: 'Teachers', value: summary?.teacherCount ?? 0, icon: GraduationCap, color: 'purple' as const, trend: 'Active now' },
    { label: 'Attendance', value: `${attendanceRate.toFixed(1)}%`, icon: TrendingUp, color: 'green' as const, trend: 'Today' },
    { label: 'Revenue', value: `$${(summary?.totalFeesCollected ?? 0).toLocaleString()}`, icon: DollarSign, color: 'orange' as const, trend: 'Fees Collected' },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10">
      <PageHeader
        title="Admin Command Center"
        subtitle="System Operational"
        actions={
          <>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2D6CDF] transition-colors" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all shadow-sm w-64"
              />
            </div>
            <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm relative">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
            </button>
          </>
        }
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Unable to load dashboard summary.'}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map((kpi, index) => (
          <StatCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-gray-900 font-black text-xl">Quick Actions</h3>
              <button className="text-[#2D6CDF] text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Enroll Student', icon: Plus, color: 'blue', target: 'students' },
                { label: 'Attendance', icon: Calendar, color: 'green', target: 'attendance' },
                { label: 'Examination', icon: Award, color: 'purple', target: 'exams' },
                { label: 'Collect Fees', icon: DollarSign, color: 'orange', target: 'fees' },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.target.startsWith('/') ? action.target : `/${action.target}`)}
                  className={`flex flex-col items-center justify-center p-6 bg-${action.color}-50/50 border border-${action.color}-100 rounded-3xl hover:bg-${action.color}-50 transition-all group`}
                >
                  <div className={`w-12 h-12 bg-${action.color}-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-${action.color}-500/20 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="text-gray-900 font-black text-xs uppercase tracking-wider">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm overflow-hidden">
            <h3 className="text-gray-900 font-black text-xl mb-6">System Health & Logs</h3>
            <div className="space-y-4">
              {[
                { title: 'Server Status', value: 'Online', status: 'Healthy', color: 'green' },
                { title: 'Database Sync', value: 'Synchronized', status: 'Active', color: 'blue' },
                { title: 'Backup Status', value: 'Today, 03:00 AM', status: 'Completed', color: 'purple' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full bg-${item.color}-500 animate-pulse`} />
                    <div>
                      <p className="text-gray-900 font-black text-sm">{item.title}</p>
                      <p className="text-gray-400 text-xs font-bold">{item.value}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 bg-${item.color}-50 text-${item.color}-600 rounded-xl text-[10px] font-black uppercase tracking-widest`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-black/20 relative overflow-hidden">
            <TrendingUp className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
            <h3 className="font-black text-2xl mb-8 relative z-10">Fee Overview</h3>
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Collected</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black">${(summary?.totalFeesCollected ?? 0).toLocaleString()}</p>
                  <span className="text-green-400 text-xs font-black mb-1">+4.2%</span>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Pending Dues</p>
                <p className="text-red-400 text-2xl font-black">${(summary?.totalFeesPending ?? 0).toLocaleString()}</p>
              </div>
              <button
                onClick={() => navigate('/fees')}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all backdrop-blur-md"
              >
                Financial Reports
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-gray-900 font-black text-xl mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Notices
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Holiday Announcement', date: 'Jan 1st - New Year', type: 'Holiday' },
                { title: 'New Lab Equipment', date: 'Science Dept', type: 'Update' },
              ].map((notice, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group cursor-pointer hover:bg-white hover:border-blue-100 transition-all">
                  <p className="text-gray-900 font-black text-sm mb-1 group-hover:text-[#2D6CDF] transition-colors">{notice.title}</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    {notice.date} • {notice.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}