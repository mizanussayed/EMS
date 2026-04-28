import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Mail, Phone, BookOpen, X, Edit, Trash2 } from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  subject?: string;
  email: string;
  phone?: string;
  qualification?: string;
  experience?: string;
  classes?: string;
  status: string;
  address?: string;
  dateOfJoining?: string;
}

interface TeachersProps {
  token: string;
}

export default function Teachers({ token }: TeachersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [teachers, setTeachers] = useState<Teacher[]>([]);

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

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/staff`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch staff');
      const data = await response.json();
      setTeachers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = async () => {
    try {
      const response = await fetch(`${apiUrl}/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          subject: formData.subject,
          email: formData.email,
          phone: formData.phone,
          qualification: formData.qualification,
          experience: formData.experience,
          classes: formData.classes,
          address: formData.address,
          dateOfJoining: formData.dateOfJoining || null,
          role: 'Teacher',
          status: 'Active'
        })
      });

      if (!response.ok) throw new Error('Failed to add teacher');
      
      await fetchTeachers();
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditTeacher = async () => {
    if (selectedTeacher) {
      try {
        const response = await fetch(`${apiUrl}/staff/${selectedTeacher.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...selectedTeacher,
            name: formData.name,
            subject: formData.subject,
            email: formData.email,
            phone: formData.phone,
            qualification: formData.qualification,
            experience: formData.experience,
            classes: formData.classes,
            address: formData.address,
            dateOfJoining: formData.dateOfJoining || null
          })
        });

        if (!response.ok) throw new Error('Failed to update teacher');
        
        await fetchTeachers();
        setShowEditModal(false);
        setSelectedTeacher(null);
        resetForm();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleDeleteTeacher = async (id: number) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        const response = await fetch(`${apiUrl}/staff/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete teacher');
        
        await fetchTeachers();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject || '',
      email: teacher.email,
      phone: teacher.phone || '',
      qualification: teacher.qualification || '',
      experience: teacher.experience || '',
      classes: teacher.classes || '',
      address: teacher.address || '',
      dateOfJoining: teacher.dateOfJoining ? new Date(teacher.dateOfJoining).toISOString().split('T')[0] : '',
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

  if (loading && teachers.length === 0) {
    return <div className="p-6 text-center">Loading staff records...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2 font-bold text-2xl">Staff Management</h1>
        <p className="text-gray-600 text-lg">Manage teaching staff and their information</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Staff</p>
          <p className="text-gray-900 mt-2 text-3xl font-bold">{teachers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active</p>
          <p className="text-green-600 mt-2 text-3xl font-bold">{activeTeachers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">On Leave</p>
          <p className="text-orange-600 mt-2 text-3xl font-bold">{onLeave}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Avg Experience</p>
          <p className="text-blue-600 mt-2 text-3xl font-bold">11y</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2D6CDF] transition-colors" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, subject, or email..." 
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all" 
              />
            </div>
          </div>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="w-full sm:w-auto px-6 py-3 bg-[#2D6CDF] text-white rounded-xl hover:bg-[#1a4ba8] flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#2D6CDF]/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Staff Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2D6CDF] font-bold text-xl border border-blue-100">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-lg mb-0.5">{teacher.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">#{String(teacher.id).padStart(4, '0')} • {teacher.qualification || 'N/A'}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => handleViewClick(teacher)}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                  title="View Details"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleEditClick(teacher)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeleteTeacher(teacher.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">{teacher.subject || 'Not Assigned'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium truncate max-w-[150px]">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">{teacher.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-gray-700 font-medium">{teacher.classes || 'No classes'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-gray-50">
              <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                teacher.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
              }`}>
                {teacher.status}
              </span>
              <p className="text-xs text-gray-400 font-medium">Exp: {teacher.experience || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 mt-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-bold text-xl mb-1">No results found</h3>
          <p className="text-gray-500">We couldn't find any staff members matching "{searchTerm}"</p>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-gray-900 font-bold text-xl">Add New Staff Member</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter staff name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Primary Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g. Mathematics"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Highest Qualification *</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                    placeholder="e.g. PhD, Masters"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="staff@school.edu"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 234-567-890"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Years of Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="e.g., 5 years"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Date of Joining</label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({...formData, dateOfJoining: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold text-sm mb-2">Assigned Classes</label>
                  <input
                    type="text"
                    value={formData.classes}
                    onChange={(e) => setFormData({...formData, classes: e.target.value})}
                    placeholder="e.g., Grade 10A, 10B"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold text-sm mb-2">Residential Address</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter full address"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  ></textarea>
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
                onClick={handleAddTeacher}
                disabled={!formData.name || !formData.email}
                className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20"
              >
                Add Staff Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-gray-900 font-bold text-xl">Edit Staff Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold text-sm mb-2">Assigned Classes</label>
                  <input
                    type="text"
                    value={formData.classes}
                    onChange={(e) => setFormData({...formData, classes: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                onClick={() => { setShowEditModal(false); resetForm(); }}
                className="px-6 py-2.5 text-gray-600 font-bold hover:bg-white rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTeacher}
                className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Teacher Modal */}
      {showViewModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-gray-900 font-bold text-xl">Staff Member Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-[#2D6CDF] font-bold text-4xl border border-gray-100">
                  {selectedTeacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-2xl mb-1">{selectedTeacher.name}</h3>
                  <p className="text-[#2D6CDF] font-bold uppercase tracking-wider text-sm">
                    {selectedTeacher.status} Member
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Staff ID</label>
                  <p className="text-gray-900 font-bold">{String(selectedTeacher.id).padStart(4, '0')}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Primary Subject</label>
                  <p className="text-gray-900 font-bold">{selectedTeacher.subject || 'Not Assigned'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Qualification</label>
                  <p className="text-gray-900 font-bold">{selectedTeacher.qualification || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Experience</label>
                  <p className="text-gray-900 font-bold">{selectedTeacher.experience || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Email Address</label>
                  <p className="text-gray-900 font-bold">{selectedTeacher.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Phone Number</label>
                  <p className="text-gray-900 font-bold">{selectedTeacher.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Date Joined</label>
                  <p className="text-gray-900 font-bold">{selectedTeacher.dateOfJoining ? new Date(selectedTeacher.dateOfJoining).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Assigned Classes</label>
                  <p className="text-gray-900 font-bold">{selectedTeacher.classes || 'None'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Current Address</label>
                  <p className="text-gray-900 font-bold bg-gray-50 p-4 rounded-xl border border-gray-100">{selectedTeacher.address || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2.5 text-gray-600 font-bold hover:bg-white rounded-xl transition-all"
              >
                Close
              </button>
              <button
                onClick={() => { setShowViewModal(false); handleEditClick(selectedTeacher); }}
                className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}