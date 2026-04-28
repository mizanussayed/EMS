import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Users, GraduationCap, Edit, Trash2, X, Eye } from 'lucide-react';

interface Class {
  id: number;
  name: string;
  section: string;
  classTeacher?: string;
  room?: string;
  schedule?: string;
  students?: number;
  subjects?: number;
  avgScore?: number;
}

interface ClassesProps {
  token: string;
}

export default function Classes({ token }: ClassesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchedule, setFilterSchedule] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [classes, setClasses] = useState<Class[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    section: '',
    classTeacher: '',
    room: '',
    schedule: 'Morning Shift',
    subjects: '8',
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cls.classTeacher?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (cls.room?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesSchedule = filterSchedule === 'All' || cls.schedule === filterSchedule;
    return matchesSearch && matchesSchedule;
  });

  const handleAddClass = async () => {
    try {
      const response = await fetch(`${apiUrl}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          section: formData.section,
          classTeacher: formData.classTeacher,
          room: formData.room,
          schedule: formData.schedule
        })
      });

      if (!response.ok) throw new Error('Failed to add class');
      
      await fetchClasses();
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditClass = async () => {
    if (selectedClass) {
      try {
        const response = await fetch(`${apiUrl}/classes/${selectedClass.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            section: formData.section,
            classTeacher: formData.classTeacher,
            room: formData.room,
            schedule: formData.schedule
          })
        });

        if (!response.ok) throw new Error('Failed to update class');
        
        await fetchClasses();
        setShowEditModal(false);
        setSelectedClass(null);
        resetForm();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleDeleteClass = async (id: number) => {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        const response = await fetch(`${apiUrl}/classes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete class');
        
        await fetchClasses();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleEditClick = (cls: Class) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      section: cls.section,
      classTeacher: cls.classTeacher || '',
      room: cls.room || '',
      schedule: cls.schedule || 'Morning Shift',
      subjects: String(cls.subjects || 8),
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
      section: '',
      classTeacher: '',
      room: '',
      schedule: 'Morning Shift',
      subjects: '8',
    });
  };

  const morningShift = classes.filter(c => c.schedule === 'Morning Shift').length;
  const afternoonShift = classes.filter(c => c.schedule === 'Afternoon Shift').length;

  if (loading && classes.length === 0) {
    return <div className="p-6 text-center">Loading classes...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Class Management</h1>
        <p className="text-gray-600">Manage classes and their information</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Classes</p>
          <p className="text-gray-900 mt-1 font-semibold">{classes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Morning Shift</p>
          <p className="text-blue-600 mt-1 font-semibold">{morningShift}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Afternoon Shift</p>
          <p className="text-orange-600 mt-1 font-semibold">{afternoonShift}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Avg Class Size</p>
          <p className="text-green-600 mt-1 font-semibold">{classes.length > 0 ? Math.round(classes.reduce((acc, c) => acc + (c.students || 0), 0) / classes.length) : 0} students</p>
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
                <h3 className="text-gray-900 mb-1 font-semibold">{cls.name} - {cls.section}</h3>
                <p className="text-sm text-gray-500">ID: {cls.id} • Room: {cls.room}</p>
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

            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4 inline-block font-medium">
              {cls.schedule}
            </span>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Class Teacher: {cls.classTeacher || 'Not Assigned'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{cls.students || 0} Students</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-gray-900 font-medium">{cls.subjects || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-gray-900 font-medium">{cls.avgScore || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Performance</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#2D6CDF]" style={{ width: `${cls.avgScore || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
          No classes found matching your criteria
        </div>
      )}

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900 text-xl font-semibold">Add New Class</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Class Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Grade 10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Section *</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    placeholder="e.g., A"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Class Teacher</label>
                  <input
                    type="text"
                    value={formData.classTeacher}
                    onChange={(e) => setFormData({...formData, classTeacher: e.target.value})}
                    placeholder="Search staff..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Room</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    placeholder="e.g., Room 201"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Schedule</label>
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
                  <label className="block text-gray-700 text-sm font-medium mb-1">Number of Subjects</label>
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
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClass}
                disabled={!formData.name || !formData.section}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900 text-xl font-semibold">Edit Class - {selectedClass.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Class Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Section *</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Class Teacher</label>
                  <input
                    type="text"
                    value={formData.classTeacher}
                    onChange={(e) => setFormData({...formData, classTeacher: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Room</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Schedule</label>
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
                  <label className="block text-gray-700 text-sm font-medium mb-1">Number of Subjects</label>
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
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditClass}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Class Modal */}
      {showViewModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900 text-xl font-semibold">Class Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Class ID</label>
                  <p className="text-gray-900">{selectedClass.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Class Name</label>
                  <p className="text-gray-900">{selectedClass.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Section</label>
                  <p className="text-gray-900">{selectedClass.section}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Class Teacher</label>
                  <p className="text-gray-900">{selectedClass.classTeacher || 'Not Assigned'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Room</label>
                  <p className="text-gray-900">{selectedClass.room || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Schedule</label>
                  <p className="text-gray-900">{selectedClass.schedule}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Total Students</label>
                  <p className="text-gray-900">{selectedClass.students || 0}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Total Subjects</label>
                  <p className="text-gray-900">{selectedClass.subjects || 0}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Average Score</label>
                  <p className="text-gray-900 font-medium text-lg">{selectedClass.avgScore || 0}%</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(selectedClass);
                }}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] transition-colors"
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

