import { useState } from 'react';
import { Search, Mail, Phone, Eye, BookOpen } from 'lucide-react';

export default function MyStudents() {
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    { id: 'STU001', rollNo: '2025001', name: 'John Smith', class: 'Grade 10A', email: 'john.smith@school.edu', phone: '+1 555-123-4567', attendance: '94%', lastGrade: 'A' },
    { id: 'STU002', rollNo: '2025002', name: 'Sarah Johnson', class: 'Grade 10A', email: 'sarah.j@school.edu', phone: '+1 555-234-5678', attendance: '97%', lastGrade: 'A+' },
    { id: 'STU003', rollNo: '2025003', name: 'Michael Brown', class: 'Grade 10B', email: 'michael.b@school.edu', phone: '+1 555-345-6789', attendance: '92%', lastGrade: 'B+' },
    { id: 'STU004', rollNo: '2025004', name: 'Emily Davis', class: 'Grade 10B', email: 'emily.d@school.edu', phone: '+1 555-456-7890', attendance: '96%', lastGrade: 'A' },
    { id: 'STU005', rollNo: '2025005', name: 'David Wilson', class: 'Grade 9A', email: 'david.w@school.edu', phone: '+1 555-567-8901', attendance: '89%', lastGrade: 'B' },
    { id: 'STU006', rollNo: '2025006', name: 'Lisa Anderson', class: 'Grade 9A', email: 'lisa.a@school.edu', phone: '+1 555-678-9012', attendance: '95%', lastGrade: 'A-' },
  ];

  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">My Students</h1>
        <p className="text-gray-600">View and manage students in your classes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-gray-900 mt-1">{students.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Grade 10A</p>
          <p className="text-blue-600 mt-1">{students.filter(s => s.class === 'Grade 10A').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Grade 10B</p>
          <p className="text-green-600 mt-1">{students.filter(s => s.class === 'Grade 10B').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Grade 9A</p>
          <p className="text-purple-600 mt-1">{students.filter(s => s.class === 'Grade 9A').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or roll number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
          >
            <option>All</option>
            <option>Grade 10A</option>
            <option>Grade 10B</option>
            <option>Grade 9A</option>
          </select>
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
                <th className="px-6 py-4 text-center text-gray-700">Attendance</th>
                <th className="px-6 py-4 text-center text-gray-700">Last Grade</th>
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
                      <p className="text-sm text-gray-500">{student.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{student.class}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{student.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {student.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {student.lastGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded" title="View Performance">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="View Details">
                        <BookOpen className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
