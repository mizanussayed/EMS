import { useState } from 'react';
import { Plus, Search, BookOpen, GraduationCap, Edit, Trash2, X, Eye } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  classes: string;
  students: number;
  credits: number;
  type: string;
}

export default function Subjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 'SUB001', name: 'Mathematics', code: 'MATH-10', teacher: 'Dr. Robert Williams', classes: 'Grade 10A, 10B', students: 67, credits: 4, type: 'Core' },
    { id: 'SUB002', name: 'English Literature', code: 'ENG-10', teacher: 'Ms. Jennifer Clark', classes: 'Grade 9A, 10A', students: 73, credits: 3, type: 'Core' },
    { id: 'SUB003', name: 'Physics', code: 'PHY-10', teacher: 'Mr. David Martinez', classes: 'Grade 10A, 10B', students: 67, credits: 4, type: 'Core' },
    { id: 'SUB004', name: 'Chemistry', code: 'CHEM-10', teacher: 'Mrs. Sarah Anderson', classes: 'Grade 9B, 10B', students: 66, credits: 4, type: 'Core' },
    { id: 'SUB005', name: 'Computer Science', code: 'CS-10', teacher: 'Mr. James Lee', classes: 'Grade 10A', students: 35, credits: 3, type: 'Elective' },
    { id: 'SUB006', name: 'Art & Design', code: 'ART-10', teacher: 'Ms. Emma Taylor', classes: 'Grade 9A, 9B', students: 72, credits: 2, type: 'Elective' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacher: '',
    classes: '',
    credits: '3',
    type: 'Core',
  });

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || subject.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddSubject = () => {
    const newSubject: Subject = {
      id: `SUB${String(subjects.length + 1).padStart(3, '0')}`,
      name: formData.name,
      code: formData.code,
      teacher: formData.teacher,
      classes: formData.classes,
      students: 0,
      credits: parseInt(formData.credits),
      type: formData.type,
    };
    setSubjects([...subjects, newSubject]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditSubject = () => {
    if (selectedSubject) {
      setSubjects(subjects.map(s =>
        s.id === selectedSubject.id
          ? { ...s, ...formData, credits: parseInt(formData.credits) }
          : s
      ));
      setShowEditModal(false);
      setSelectedSubject(null);
      resetForm();
    }
  };

  const handleDeleteSubject = (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const handleEditClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      teacher: subject.teacher,
      classes: subject.classes,
      credits: String(subject.credits),
      type: subject.type,
    });
    setShowEditModal(true);
  };

  const handleViewClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      teacher: '',
      classes: '',
      credits: '3',
      type: 'Core',
    });
  };

  const coreSubjects = subjects.filter(s => s.type === 'Core').length;
  const electives = subjects.filter(s => s.type === 'Elective').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Subject Management</h1>
        <p className="text-gray-600">Manage subjects and curriculum</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Subjects</p>
          <p className="text-gray-900 mt-1">{subjects.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Core Subjects</p>
          <p className="text-blue-600 mt-1">{coreSubjects}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Electives</p>
          <p className="text-purple-600 mt-1">{electives}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Teachers Assigned</p>
          <p className="text-green-600 mt-1">{new Set(subjects.map(s => s.teacher)).size}</p>
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
                placeholder="Search subjects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              <option>All</option>
              <option>Core</option>
              <option>Elective</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Subject Code</th>
                <th className="px-6 py-4 text-left text-gray-700">Subject Name</th>
                <th className="px-6 py-4 text-left text-gray-700">Teacher</th>
                <th className="px-6 py-4 text-left text-gray-700">Classes</th>
                <th className="px-6 py-4 text-center text-gray-700">Students</th>
                <th className="px-6 py-4 text-center text-gray-700">Credits</th>
                <th className="px-6 py-4 text-center text-gray-700">Type</th>
                <th className="px-6 py-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{subject.code}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#2D6CDF]" />
                      <span className="text-gray-900">{subject.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{subject.teacher}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{subject.classes}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{subject.students}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{subject.credits}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      subject.type === 'Core' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {subject.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewClick(subject)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditClick(subject)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
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
        {filteredSubjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No subjects found matching your criteria
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-1 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Add New Subject</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Subject Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Subject Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g., MATH-10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Teacher *</label>
                  <input
                    type="text"
                    value={formData.teacher}
                    onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Classes</label>
                  <input
                    type="text"
                    value={formData.classes}
                    onChange={(e) => setFormData({...formData, classes: e.target.value})}
                    placeholder="e.g., Grade 10A, 10B"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Credits</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option>Core</option>
                    <option>Elective</option>
                  </select>
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
                onClick={handleAddSubject}
                disabled={!formData.name || !formData.code || !formData.teacher}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Edit Subject - {selectedSubject.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Subject Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Subject Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Teacher *</label>
                  <input
                    type="text"
                    value={formData.teacher}
                    onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Classes</label>
                  <input
                    type="text"
                    value={formData.classes}
                    onChange={(e) => setFormData({...formData, classes: e.target.value})}
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
                onClick={handleEditSubject}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Subject Modal */}
      {showViewModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Subject Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Subject ID</label>
                  <p className="text-gray-900">{selectedSubject.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Subject Code</label>
                  <p className="text-gray-900">{selectedSubject.code}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Subject Name</label>
                  <p className="text-gray-900">{selectedSubject.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Teacher</label>
                  <p className="text-gray-900">{selectedSubject.teacher}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Credits</label>
                  <p className="text-gray-900">{selectedSubject.credits}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Classes</label>
                  <p className="text-gray-900">{selectedSubject.classes}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Students</label>
                  <p className="text-gray-900">{selectedSubject.students}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Type</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    selectedSubject.type === 'Core' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {selectedSubject.type}
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
                  handleEditClick(selectedSubject);
                }}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Edit Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
