import { useState } from 'react';
import { Plus, Search, Users, GraduationCap, Edit, Trash2, X, Eye } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  classTeacher: string;
  students: number;
  subjects: number;
  room: string;
  schedule: string;
  avgScore: number;
}

export default function Classes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchedule, setFilterSchedule] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const [classes, setClasses] = useState<Class[]>([
    { id: 'CLS001', name: 'Grade 10A', classTeacher: 'Dr. Robert Williams', students: 35, subjects: 8, room: 'Room 201', schedule: 'Morning Shift', avgScore: 87 },
    { id: 'CLS002', name: 'Grade 10B', classTeacher: 'Ms. Jennifer Clark', students: 32, subjects: 8, room: 'Room 202', schedule: 'Morning Shift', avgScore: 82 },
    { id: 'CLS003', name: 'Grade 9A', classTeacher: 'Mr. David Martinez', students: 38, subjects: 9, room: 'Room 101', schedule: 'Morning Shift', avgScore: 89 },
    { id: 'CLS004', name: 'Grade 9B', classTeacher: 'Mrs. Sarah Anderson', students: 34, subjects: 9, room: 'Room 102', schedule: 'Afternoon Shift', avgScore: 85 },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    classTeacher: '',
    room: '',
    schedule: 'Morning Shift',
    subjects: '8',
  });

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchedule = filterSchedule === 'All' || cls.schedule === filterSchedule;
    return matchesSearch && matchesSchedule;
  });

  const handleAddClass = () => {
    const newClass: Class = {
      id: `CLS${String(classes.length + 1).padStart(3, '0')}`,
      name: formData.name,
      classTeacher: formData.classTeacher,
      students: 0,
      subjects: parseInt(formData.subjects),
      room: formData.room,
      schedule: formData.schedule,
      avgScore: 0,
    };
    setClasses([...classes, newClass]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditClass = () => {
    if (selectedClass) {
      setClasses(classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, ...formData, subjects: parseInt(formData.subjects) }
          : c
      ));
      setShowEditModal(false);
      setSelectedClass(null);
      resetForm();
    }
  };

  const handleDeleteClass = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  const handleEditClick = (cls: Class) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      classTeacher: cls.classTeacher,
      room: cls.room,
      schedule: cls.schedule,
      subjects: String(cls.subjects),
    });
    setShowEditModal(true);
  };

  const handleViewClick = (cls: Class) => {
    setSelectedClass(cls);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      classTeacher: '',
      room: '',
      schedule: 'Morning Shift',
      subjects: '8',
    });
  };

  const morningShift = classes.filter(c => c.schedule === 'Morning Shift').length;
  const afternoonShift = classes.filter(c => c.schedule === 'Afternoon Shift').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Class Management</h1>
        <p className="text-gray-600">Manage classes and their information</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Classes</p>
          <p className="text-gray-900 mt-1">{classes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Morning Shift</p>
          <p className="text-blue-600 mt-1">{morningShift}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Afternoon Shift</p>
          <p className="text-orange-600 mt-1">{afternoonShift}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Avg Class Size</p>
          <p className="text-green-600 mt-1">{Math.round(classes.reduce((acc, c) => acc + c.students, 0) / classes.length) || 0} students</p>
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
                placeholder="Search classes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterSchedule}
              onChange={(e) => setFilterSchedule(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              <option>All</option>
              <option>Morning Shift</option>
              <option>Afternoon Shift</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Class
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-900 mb-1">{cls.name}</h3>
                <p className="text-sm text-gray-500">{cls.id} • {cls.room}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewClick(cls)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleEditClick(cls)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4 inline-block">
              {cls.schedule}
            </span>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Class Teacher: {cls.classTeacher}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{cls.students} Students</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-gray-900">{cls.subjects}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-gray-900">{cls.avgScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Performance</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#2D6CDF]" style={{ width: `${cls.avgScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-white rounded-xl">
          No classes found matching your criteria
        </div>
      )}

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Add New Class</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Class Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Grade 10A"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Class Teacher *</label>
                  <input
                    type="text"
                    value={formData.classTeacher}
                    onChange={(e) => setFormData({...formData, classTeacher: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Room *</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    placeholder="e.g., Room 201"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Schedule *</label>
                  <select
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option>Morning Shift</option>
                    <option>Afternoon Shift</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Number of Subjects</label>
                  <input
                    type="number"
                    value={formData.subjects}
                    onChange={(e) => setFormData({...formData, subjects: e.target.value})}
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
                onClick={handleAddClass}
                disabled={!formData.name || !formData.classTeacher || !formData.room}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Edit Class - {selectedClass.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Class Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Class Teacher *</label>
                  <input
                    type="text"
                    value={formData.classTeacher}
                    onChange={(e) => setFormData({...formData, classTeacher: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Room *</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Schedule *</label>
                  <select
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option>Morning Shift</option>
                    <option>Afternoon Shift</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Number of Subjects</label>
                  <input
                    type="number"
                    value={formData.subjects}
                    onChange={(e) => setFormData({...formData, subjects: e.target.value})}
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
                onClick={handleEditClass}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Class Modal */}
      {showViewModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Class Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Class ID</label>
                  <p className="text-gray-900">{selectedClass.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Class Name</label>
                  <p className="text-gray-900">{selectedClass.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Class Teacher</label>
                  <p className="text-gray-900">{selectedClass.classTeacher}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Room</label>
                  <p className="text-gray-900">{selectedClass.room}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Schedule</label>
                  <p className="text-gray-900">{selectedClass.schedule}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Students</label>
                  <p className="text-gray-900">{selectedClass.students}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Subjects</label>
                  <p className="text-gray-900">{selectedClass.subjects}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Average Score</label>
                  <p className="text-gray-900">{selectedClass.avgScore}%</p>
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
                  handleEditClick(selectedClass);
                }}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Edit Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
