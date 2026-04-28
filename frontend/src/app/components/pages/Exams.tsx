import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Calendar, FileText, Edit, Trash2, X, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Exam {
  id: number;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  className?: string;
}

interface ExamsProps {
  token: string;
}

export default function Exams({ token }: ExamsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [formData, setFormData] = useState({
    title: '',
    type: 'Mid-term',
    className: '',
    startDate: '',
    endDate: '',
    status: 'Scheduled',
  });

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/exams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch exams');
      const data = await response.json();
      setExams(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exam.className?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || exam.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddExam = async () => {
    try {
      const response = await fetch(`${apiUrl}/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to schedule exam');
      
      await fetchExams();
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleViewClick = (exam: Exam) => {
    setSelectedExam(exam);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Mid-term',
      className: '',
      startDate: '',
      endDate: '',
      status: 'Scheduled',
    });
  };

  const scheduledExams = exams.filter(e => e.status === 'Scheduled').length;
  const completedExams = exams.filter(e => e.status === 'Completed').length;
  const ongoingExams = exams.filter(e => e.status === 'Ongoing').length;

  if (loading && exams.length === 0) {
    return <div className="p-6 text-center">Loading examination schedule...</div>;
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-bold text-3xl mb-2">Exam Management</h1>
          <p className="text-gray-500 font-medium">Schedule and track academic evaluations</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="px-6 py-3 bg-[#2D6CDF] text-white rounded-xl hover:bg-[#1a4ba8] flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#2D6CDF]/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Schedule New Exam
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Exams', value: exams.length, color: 'blue', icon: FileText },
          { label: 'Scheduled', value: scheduledExams, color: 'indigo', icon: Calendar },
          { label: 'Ongoing', value: ongoingExams, color: 'orange', icon: Clock },
          { label: 'Completed', value: completedExams, color: 'green', icon: CheckCircle },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4 text-${stat.color}-600`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-gray-900 text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/30">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or class..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all font-bold text-gray-700"
            >
              <option>All</option>
              <option>Scheduled</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Exam Details</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Class</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Timeline</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2D6CDF] font-bold text-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold group-hover:text-[#2D6CDF] transition-colors">{exam.title}</p>
                        <p className="text-gray-400 text-xs font-medium">{exam.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                      {exam.className || 'All Classes'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-700 font-bold">{new Date(exam.startDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400 font-medium">to {new Date(exam.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      exam.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                      exam.status === 'Ongoing' ? 'bg-orange-50 text-orange-700 border border-orange-100 animate-pulse' :
                      'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewClick(exam)}
                        className="p-2 hover:bg-blue-50 rounded-xl transition-colors text-blue-600"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredExams.length === 0 && (
          <div className="text-center py-20 bg-gray-50/30">
            <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-gray-900 font-bold text-xl mb-1">No results found</h3>
            <p className="text-gray-500">We couldn't find any exams matching your current criteria.</p>
          </div>
        )}
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-gray-900 font-black text-xl">Schedule New Examination</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold text-sm mb-2">Exam Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Annual Final Term 2025"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Exam Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  >
                    <option>Mid-term</option>
                    <option>Final</option>
                    <option>Unit Test</option>
                    <option>Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Class / Section</label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({...formData, className: e.target.value})}
                    placeholder="e.g. Grade 10A"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="px-6 py-2.5 text-gray-600 font-bold hover:bg-white rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExam}
                disabled={!formData.title || !formData.startDate || !formData.endDate}
                className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-2xl font-black hover:bg-[#1a4ba8] disabled:opacity-50 transition-all active:scale-95 shadow-xl shadow-[#2D6CDF]/30"
              >
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Exam Modal */}
      {showViewModal && selectedExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setShowViewModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2D6CDF] mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-gray-900 font-black text-2xl mb-1">{selectedExam.title}</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{selectedExam.type}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Class Assigned</p>
                <p className="text-gray-900 font-black">{selectedExam.className || 'General'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Current Status</p>
                <p className="text-[#2D6CDF] font-black">{selectedExam.status}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Start Date</p>
                <p className="text-gray-900 font-black">{new Date(selectedExam.startDate).toLocaleDateString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-black uppercase mb-1">End Date</p>
                <p className="text-gray-900 font-black">{new Date(selectedExam.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-black/10"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
