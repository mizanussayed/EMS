import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Eye, X, Users, Calendar } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { StatCard } from '../ui/StatCard';

interface Student {
  id: number;
  rollNo: string;
  name: string;
  className: string;
  section?: string;
  email?: string;
  phone?: string;
  parent?: string;
  parentPhone?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  status: 'Active' | 'Inactive';
  attendance?: string;
  admissionNumber?: string;
  address?: string;
  gender?: string;
}

interface ApiStudent {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  className?: string;
  section?: string;
  gender?: string;
  dateOfBirth?: string;
  active: boolean;
}

interface StudentsProps {
  token?: string;
}

const mapStudentFromApi = (student: ApiStudent): Student => ({
  id: student.id,
  rollNo: student.admissionNumber ?? `STU-${student.id}`,
  name: `${student.firstName} ${student.lastName}`.trim(),
  className: student.className ?? 'Unassigned',
  section: student.section ?? '',
  email: '',
  phone: '',
  parent: '',
  parentPhone: '',
  dateOfBirth: student.dateOfBirth ?? '',
  admissionDate: '',
  status: student.active ? 'Active' : 'Inactive',
  attendance: '—',
  admissionNumber: student.admissionNumber ?? '',
  gender: student.gender ?? '',
});

export default function Students({ token }: StudentsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    admissionNumber: '',
    dateOfBirth: '',
    gender: 'Male',
    className: 'Grade 10A',
    section: 'A',
    admissionDate: '',
    email: '',
    phone: '',
    parent: '',
    parentPhone: '',
    address: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const classOptions = useMemo(() => {
    const classSet = new Set(
      students
        .map((student) => student.className)
        .filter((value): value is string => Boolean(value))
    );
    return ['All', ...Array.from(classSet)];
  }, [students]);

  useEffect(() => {
    let active = true;

    const loadStudents = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`${apiUrl}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Unable to load students.');
        }
        const data = (await response.json()) as ApiStudent[];
        if (active) {
          setStudents(data.map(mapStudentFromApi));
        }
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : 'Unable to load students.';
          setErrorMessage(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStudents();

    return () => {
      active = false;
    };
  }, []);

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'All' || student.className === filterClass;
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleAddStudent = async () => {
    if (!token) {
      setErrorMessage('Please sign in before adding students.');
      return;
    }

    setErrorMessage(null);
    try {
      const response = await fetch(`${apiUrl}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          admissionNumber: formData.admissionNumber || undefined,
          className: formData.className || undefined,
          section: formData.section || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          active: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to add student.');
      }

      const created = (await response.json()) as ApiStudent;
      setStudents((current) => [mapStudentFromApi(created), ...current]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to add student.';
      setErrorMessage(message);
    }
  };

  const handleEditStudent = async () => {
    if (!selectedStudent) {
      return;
    }
    if (!token) {
      setErrorMessage('Please sign in before editing students.');
      return;
    }


    setErrorMessage(null);
    try {
      const response = await fetch(`${apiUrl}/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          admissionNumber: formData.admissionNumber || undefined,
          className: formData.className || undefined,
          section: formData.section || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          active: selectedStudent.status === 'Active',
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to update student.');
      }

      setStudents((current) =>
        current.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                className: formData.className,
                section: formData.section,
                admissionNumber: formData.admissionNumber,
                rollNo: formData.admissionNumber || student.rollNo,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
              }
            : student
        )
      );

      setShowEditModal(false);
      setSelectedStudent(null);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update student.';
      setErrorMessage(message);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!token) {
      setErrorMessage('Please sign in before deleting students.');
      return;
    }
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    setErrorMessage(null);
    try {
      const response = await fetch(`${apiUrl}/students/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unable to delete student.');
      }

      setStudents((current) => current.filter((student) => student.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete student.';
      setErrorMessage(message);
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    const nameParts = student.name.split(' ');
    setFormData({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      admissionNumber: student.admissionNumber || '',
      dateOfBirth: student.dateOfBirth,
      gender: student.gender || 'Male',
      className: student.className,
      section: student.section || '',
      admissionDate: student.admissionDate,
      email: student.email,
      phone: student.phone,
      parent: student.parent,
      parentPhone: student.parentPhone,
      address: student.address || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      admissionNumber: '',
      dateOfBirth: '',
      gender: 'Male',
      className: 'Grade 10A',
      section: 'A',
      admissionDate: '',
      email: '',
      phone: '',
      parent: '',
      parentPhone: '',
      address: '',
    });
  };

  const activeStudents = students.filter(s => s.status === 'Active').length;
  const newThisMonth = 2;
  const avgAttendance = '94.2%';

  return (
    <div className="p-6">
      <PageHeader 
        title="Student Management" 
        subtitle="Student Records Database"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-[#2D6CDF] text-white rounded-2xl hover:bg-[#1a4ba8] flex items-center gap-2 font-black shadow-xl shadow-[#2D6CDF]/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Enroll Student
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
        <StatCard label="Total Students" value={students.length} icon={Users} color="blue" trend="Active students" />
        <StatCard label="Active" value={activeStudents} icon={Users} color="green" trend="Current status" />
        <StatCard label="New This Month" value={newThisMonth} icon={Plus} color="purple" trend="Latest enrollments" />
        <StatCard label="Avg Attendance" value={avgAttendance} icon={Calendar} color="orange" trend="Year to date" />
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, roll no, class..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select 
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              {classOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Roll No</th>
                <th className="px-6 py-4 text-left text-gray-700">Student Name</th>
                <th className="px-6 py-4 text-left text-gray-700">Class</th>
                <th className="px-6 py-4 text-left text-gray-700">Contact</th>
                <th className="px-6 py-4 text-left text-gray-700">Parent/Guardian</th>
                <th className="px-6 py-4 text-center text-gray-700">Attendance</th>
                <th className="px-6 py-4 text-center text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{student.rollNo}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{`STU-${student.id}`}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{student.className}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{student.email || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{student.phone || '—'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{student.parent || '—'}</p>
                      <p className="text-sm text-gray-500">{student.parentPhone || '—'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {student.attendance || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        student.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleViewStudent(student)}
                        className="p-1 hover:bg-gray-100 rounded" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(student)}
                        className="p-1 hover:bg-gray-100 rounded" 
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)}
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
        {loading && (
          <div className="text-center py-8 text-gray-500">Loading students...</div>
        )}
        {!loading && filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found matching your criteria
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Add New Student</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Admission Number</label>
                  <input
                    type="text"
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Gender *</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Class *</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option>Grade 10A</option>
                    <option>Grade 10B</option>
                    <option>Grade 9A</option>
                    <option>Grade 9B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Section</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Admission Date *</label>
                  <input
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Parent/Guardian Name *</label>
                  <input
                    type="text"
                    value={formData.parent}
                    onChange={(e) => setFormData({...formData, parent: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Parent Phone *</label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Address</label>
                  <textarea
                    rows={3}
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
                onClick={handleAddStudent}
                disabled={!formData.firstName || !formData.lastName}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Edit Student - {selectedStudent.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Admission Number</label>
                  <input
                    type="text"
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Parent/Guardian Name *</label>
                  <input
                    type="text"
                    value={formData.parent}
                    onChange={(e) => setFormData({...formData, parent: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Parent Phone *</label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
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
                onClick={handleEditStudent}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Student Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Student ID</label>
                  <p className="text-gray-900">{selectedStudent.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Roll Number</label>
                  <p className="text-gray-900">{selectedStudent.rollNo}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="text-gray-900">{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Class</label>
                  <p className="text-gray-900">{selectedStudent.className}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">{selectedStudent.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Gender</label>
                  <p className="text-gray-900">{selectedStudent.gender}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedStudent.email || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="text-gray-900">{selectedStudent.phone || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Parent/Guardian</label>
                  <p className="text-gray-900">{selectedStudent.parent || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Parent Phone</label>
                  <p className="text-gray-900">{selectedStudent.parentPhone || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Admission Date</label>
                  <p className="text-gray-900">{selectedStudent.admissionDate || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Attendance</label>
                  <p className="text-gray-900">{selectedStudent.attendance || '—'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="text-gray-900">{selectedStudent.address || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      selectedStudent.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {selectedStudent.status}
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
                  handleEditClick(selectedStudent);
                }}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Edit Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}