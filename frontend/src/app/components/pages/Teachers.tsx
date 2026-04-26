import { useState } from 'react';
import { Plus, Search, Mail, Phone, BookOpen, X, Edit, Trash2 } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  classes: string;
  status: string;
  address?: string;
  dateOfJoining?: string;
}

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 'TCH001', name: 'Dr. Robert Williams', subject: 'Mathematics', email: 'r.williams@school.edu', phone: '+1 555-1001', qualification: 'PhD in Mathematics', experience: '15 years', classes: 'Grade 10A, 10B', status: 'Active', address: '123 Teacher Lane', dateOfJoining: '2010-08-15' },
    { id: 'TCH002', name: 'Ms. Jennifer Clark', subject: 'English Literature', email: 'j.clark@school.edu', phone: '+1 555-1002', qualification: 'MA in English', experience: '10 years', classes: 'Grade 9A, 10A', status: 'Active', address: '456 Scholar St', dateOfJoining: '2015-07-20' },
    { id: 'TCH003', name: 'Mr. David Martinez', subject: 'Physics', email: 'd.martinez@school.edu', phone: '+1 555-1003', qualification: 'MSc in Physics', experience: '8 years', classes: 'Grade 10A, 10B', status: 'Active', address: '789 Science Ave', dateOfJoining: '2017-09-01' },
    { id: 'TCH004', name: 'Mrs. Sarah Anderson', subject: 'Chemistry', email: 's.anderson@school.edu', phone: '+1 555-1004', qualification: 'MSc in Chemistry', experience: '12 years', classes: 'Grade 9B, 10B', status: 'On Leave', address: '321 Lab Road', dateOfJoining: '2013-08-10' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    classes: '',
    address: '',
    dateOfJoining: '',
  });

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = () => {
    const newTeacher: Teacher = {
      id: `TCH${String(teachers.length + 1).padStart(3, '0')}`,
      name: formData.name,
      subject: formData.subject,
      email: formData.email,
      phone: formData.phone,
      qualification: formData.qualification,
      experience: formData.experience,
      classes: formData.classes,
      status: 'Active',
      address: formData.address,
      dateOfJoining: formData.dateOfJoining,
    };
    setTeachers([...teachers, newTeacher]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditTeacher = () => {
    if (selectedTeacher) {
      setTeachers(teachers.map(t => 
        t.id === selectedTeacher.id ? { ...t, ...formData } : t
      ));
      setShowEditModal(false);
      setSelectedTeacher(null);
      resetForm();
    }
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      email: teacher.email,
      phone: teacher.phone,
      qualification: teacher.qualification,
      experience: teacher.experience,
      classes: teacher.classes,
      address: teacher.address || '',
      dateOfJoining: teacher.dateOfJoining || '',
    });
    setShowEditModal(true);
  };

  const handleViewClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      email: '',
      phone: '',
      qualification: '',
      experience: '',
      classes: '',
      address: '',
      dateOfJoining: '',
    });
  };

  const activeTeachers = teachers.filter(t => t.status === 'Active').length;
  const onLeave = teachers.filter(t => t.status === 'On Leave').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Teacher Management</h1>
        <p className="text-gray-600">Manage teaching staff and their information</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Teachers</p>
          <p className="text-gray-900 mt-1">{teachers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-green-600 mt-1">{activeTeachers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">On Leave</p>
          <p className="text-orange-600 mt-1">{onLeave}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Avg Experience</p>
          <p className="text-blue-600 mt-1">11 years</p>
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
                placeholder="Search teachers..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]" 
              />
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-900 mb-1">{teacher.name}</h3>
                <p className="text-sm text-gray-500">{teacher.id} • {teacher.qualification}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewClick(teacher)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="View Details"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </button>
                <button 
                  onClick={() => handleEditClick(teacher)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => handleDeleteTeacher(teacher.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{teacher.subject}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{teacher.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 mb-4">
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="text-gray-900">{teacher.experience}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-gray-900">{teacher.classes}</p>
              </div>
            </div>

            <span className={`inline-block px-3 py-1 rounded-full text-sm ${teacher.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {teacher.status}
            </span>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-white rounded-xl">
          No teachers found matching your search
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Add New Teacher</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
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
                  <label className="block text-gray-700 mb-2">Qualification *</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="e.g., 5 years"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Date of Joining</label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({...formData, dateOfJoining: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Assigned Classes</label>
                  <input
                    type="text"
                    value={formData.classes}
                    onChange={(e) => setFormData({...formData, classes: e.target.value})}
                    placeholder="e.g., Grade 10A, 10B"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Address</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  ></textarea>
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
                onClick={handleAddTeacher}
                disabled={!formData.name || !formData.subject || !formData.email}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Edit Teacher - {selectedTeacher.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Assigned Classes</label>
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
                onClick={handleEditTeacher}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Teacher Modal */}
      {showViewModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Teacher Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Teacher ID</label>
                  <p className="text-gray-900">{selectedTeacher.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="text-gray-900">{selectedTeacher.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Subject</label>
                  <p className="text-gray-900">{selectedTeacher.subject}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Qualification</label>
                  <p className="text-gray-900">{selectedTeacher.qualification}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedTeacher.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="text-gray-900">{selectedTeacher.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Experience</label>
                  <p className="text-gray-900">{selectedTeacher.experience}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date of Joining</label>
                  <p className="text-gray-900">{selectedTeacher.dateOfJoining || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Assigned Classes</label>
                  <p className="text-gray-900">{selectedTeacher.classes}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="text-gray-900">{selectedTeacher.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${selectedTeacher.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {selectedTeacher.status}
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
                  handleEditClick(selectedTeacher);
                }}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Edit Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}