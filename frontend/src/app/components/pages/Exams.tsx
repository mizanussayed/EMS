import { useState } from 'react';
import { Plus, Search, Calendar, FileText, Edit, Trash2, X, Eye } from 'lucide-react';

interface Exam {
  id: string;
  name: string;
  type: string;
  class: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  marks: number;
  status: string;
}

export default function Exams() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const [exams, setExams] = useState<Exam[]>([
    { id: 'EXM001', name: 'Mid-term Examination', type: 'Mid-term', class: 'Grade 10A', subject: 'Mathematics', date: '2025-12-10', time: '09:00 AM - 12:00 PM', duration: '3 hours', marks: 100, status: 'Scheduled' },
    { id: 'EXM002', name: 'Mid-term Examination', type: 'Mid-term', class: 'Grade 10A', subject: 'Physics', date: '2025-12-12', time: '09:00 AM - 12:00 PM', duration: '3 hours', marks: 100, status: 'Scheduled' },
    { id: 'EXM003', name: 'Unit Test', type: 'Unit Test', class: 'Grade 9A', subject: 'English', date: '2025-11-28', time: '10:00 AM - 11:30 AM', duration: '1.5 hours', marks: 50, status: 'Completed' },
    { id: 'EXM004', name: 'Final Examination', type: 'Final', class: 'Grade 10B', subject: 'Chemistry', date: '2025-12-20', time: '09:00 AM - 12:00 PM', duration: '3 hours', marks: 100, status: 'Scheduled' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Mid-term',
    class: 'Grade 10A',
    subject: '',
    date: '',
    time: '',
    duration: '',
    marks: '100',
  });

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || exam.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddExam = () => {
    const newExam: Exam = {
      id: `EXM${String(exams.length + 1).padStart(3, '0')}`,
      name: formData.name,
      type: formData.type,
      class: formData.class,
      subject: formData.subject,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      marks: parseInt(formData.marks),
      status: 'Scheduled',
    };
    setExams([...exams, newExam]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditExam = () => {
    if (selectedExam) {
      setExams(exams.map(e =>
        e.id === selectedExam.id
          ? { ...e, ...formData, marks: parseInt(formData.marks) }
          : e
      ));
      setShowEditModal(false);
      setSelectedExam(null);
      resetForm();
    }
  };

  const handleDeleteExam = (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  const handleEditClick = (exam: Exam) => {
    setSelectedExam(exam);
    setFormData({
      name: exam.name,
      type: exam.type,
      class: exam.class,
      subject: exam.subject,
      date: exam.date,
      time: exam.time,
      duration: exam.duration,
      marks: String(exam.marks),
    });
    setShowEditModal(true);
  };

  const handleViewClick = (exam: Exam) => {
    setSelectedExam(exam);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Mid-term',
      class: 'Grade 10A',
      subject: '',
      date: '',
      time: '',
      duration: '',
      marks: '100',
    });
  };

  const scheduledExams = exams.filter(e => e.status === 'Scheduled').length;
  const completedExams = exams.filter(e => e.status === 'Completed').length;
  const inProgressExams = exams.filter(e => e.status === 'In Progress').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Exam Management</h1>
        <p className="text-gray-600">Schedule and manage examinations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Exams</p>
          <p className="text-gray-900 mt-1">{exams.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Scheduled</p>
          <p className="text-blue-600 mt-1">{scheduledExams}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-orange-600 mt-1">{inProgressExams}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-green-600 mt-1">{completedExams}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search exams..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              <option>All</option>
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Schedule Exam
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Exam ID</th>
                <th className="px-6 py-4 text-left text-gray-700">Exam Name</th>
                <th className="px-6 py-4 text-left text-gray-700">Class</th>
                <th className="px-6 py-4 text-left text-gray-700">Subject</th>
                <th className="px-6 py-4 text-left text-gray-700">Date & Time</th>
                <th className="px-6 py-4 text-center text-gray-700">Duration</th>
                <th className="px-6 py-4 text-center text-gray-700">Marks</th>
                <th className="px-6 py-4 text-center text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{exam.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#2D6CDF]" />
                      <div>
                        <p className="text-gray-900">{exam.name}</p>
                        <p className="text-sm text-gray-500">{exam.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{exam.class}</td>
                  <td className="px-6 py-4 text-gray-900">{exam.subject}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-900">{exam.date}</p>
                        <p className="text-sm text-gray-500">{exam.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900">{exam.duration}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{exam.marks}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      exam.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      exam.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewClick(exam)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditClick(exam)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredExams.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No exams found matching your criteria
          </div>
        )}
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Schedule New Exam</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Exam Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Mid-term Examination"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Exam Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option>Mid-term</option>
                    <option>Final</option>
                    <option>Unit Test</option>
                    <option>Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Class *</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option>Grade 10A</option>
                    <option>Grade 10B</option>
                    <option>Grade 9A</option>
                    <option>Grade 9B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Total Marks *</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({...formData, marks: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Time *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    placeholder="e.g., 09:00 AM - 12:00 PM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 3 hours"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExam}
                disabled={!formData.name || !formData.subject || !formData.date}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {showEditModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Edit Exam - {selectedExam.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Exam Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Time *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditExam}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Exam Modal */}
      {showViewModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Exam Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Exam ID</label>
                  <p className="text-gray-900">{selectedExam.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Exam Type</label>
                  <p className="text-gray-900">{selectedExam.type}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Exam Name</label>
                  <p className="text-gray-900">{selectedExam.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Class</label>
                  <p className="text-gray-900">{selectedExam.class}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Subject</label>
                  <p className="text-gray-900">{selectedExam.subject}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date</label>
                  <p className="text-gray-900">{selectedExam.date}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Time</label>
                  <p className="text-gray-900">{selectedExam.time}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Duration</label>
                  <p className="text-gray-900">{selectedExam.duration}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Marks</label>
                  <p className="text-gray-900">{selectedExam.marks}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    selectedExam.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    selectedExam.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedExam.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(selectedExam);
                }}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Edit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
