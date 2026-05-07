import { useMemo, useState } from 'react';
import { BarChart3, Download, FileText, TrendingUp, Calendar, Search } from 'lucide-react';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboardSummary';

export default function ReportsView() {
  const { toasts, remove, warning, info } = useToast();
  const [selectedReportType, setSelectedReportType] = useState('Student Report');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportSearch, setReportSearch] = useState('');
  const [generatedReports, setGeneratedReports] = useState<{ name: string; category: string; date: string; type: string }[]>([]);
  const summaryQuery = useDashboardSummary();

  const summary = summaryQuery.data;

  const reportCategories = useMemo(
    () => [
      { title: 'Student Reports', icon: FileText, count: summary?.studentCount ?? 0, color: 'bg-blue-500' },
      { title: 'Academic Reports', icon: BarChart3, count: summary?.classCount ?? 0, color: 'bg-green-500' },
      { title: 'Attendance Reports', icon: TrendingUp, count: summary?.attendanceCount ?? 0, color: 'bg-orange-500' },
      { title: 'Financial Reports', icon: FileText, count: Math.round(summary?.totalFeesCollected ?? 0), color: 'bg-purple-500' },
    ],
    [summary]
  );

  const filteredReports = generatedReports.filter((report) =>
    report.name.toLowerCase().includes(reportSearch.toLowerCase()) ||
    report.category.toLowerCase().includes(reportSearch.toLowerCase())
  );

  const handleGenerateReport = () => {
    if (!fromDate || !toDate) {
      warning('Please select both from and to dates.');
      return;
    }
    const generated = {
      name: selectedReportType,
      category: selectedReportType.replace(' Report', ''),
      date: new Date().toISOString().slice(0, 10),
      type: 'CSV',
    };
    setGeneratedReports((current) => [generated, ...current]);
    info(`${selectedReportType} generated from backend summary data.`);
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="mb-10">
          <h1 className="text-gray-900 font-black text-3xl mb-2">Reports & Analytics</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Generate and view detailed system data</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {reportCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 font-black text-lg mb-1">{category.title}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{summaryQuery.isLoading ? 'Loading' : category.count} Records</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
            <h2 className="text-gray-900 font-black text-xl mb-8">Generate Custom Report</h2>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Report Type</label>
                <select value={selectedReportType} onChange={(e) => setSelectedReportType(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold text-gray-700">
                  <option>Student Report</option>
                  <option>Academic Report</option>
                  <option>Attendance Report</option>
                  <option>Financial Report</option>
                  <option>Class Performance Report</option>
                  <option>Teacher Performance Report</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">From Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">To Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold" />
                  </div>
                </div>
              </div>
              <button onClick={handleGenerateReport} className="w-full py-5 bg-[#2D6CDF] text-white rounded-2xl font-black shadow-xl shadow-[#2D6CDF]/20 hover:bg-[#1a4ba8] transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                <BarChart3 className="w-5 h-5" />
                Generate Analytical Report
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <TrendingUp className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
            <h2 className="text-xl font-black mb-8 relative z-10">Historical Pulse</h2>
            <div className="space-y-6 relative z-10">
              {[
                { label: 'Present Today', value: String(summary?.presentCount ?? 0), color: 'text-green-400' },
                { label: 'Absent Today', value: String(summary?.absentCount ?? 0), color: 'text-blue-400' },
                { label: 'Fee Collected', value: String(Math.round(summary?.totalFeesCollected ?? 0)), color: 'text-orange-400' },
                { label: 'Fee Pending', value: String(Math.round(summary?.totalFeesPending ?? 0)), color: 'text-purple-400' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</span>
                  <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-gray-900 font-black text-xl">Recent Generations</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={reportSearch} onChange={(event) => setReportSearch(event.target.value)} placeholder="Filter reports..." className="pl-12 pr-6 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Report Name</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Generated On</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((report, index) => (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#2D6CDF] transition-all">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-gray-900 font-bold">{report.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{report.category}</span>
                    </td>
                    <td className="px-8 py-6 text-gray-500 font-medium">{report.date}</td>
                    <td className="px-8 py-6 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#2D6CDF] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#2D6CDF] hover:text-white transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                        {report.type}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td className="px-8 py-10 text-center text-gray-500 font-medium" colSpan={4}>
                      No generated reports yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </RoleGuard>
  );
}
