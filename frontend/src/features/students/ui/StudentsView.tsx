import { ChangeEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, BookOpen, User, Calendar, MapPin, Upload, Download, FileText, Search, Filter, X } from 'lucide-react';
import { formatDateForDisplay } from '@/utils/dateUtils';
import type {Student, StudentInput } from '../model/student.types';
import GenericForm, { FormField } from '@/components/GenericForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useConfirm, useToast } from '@/hooks/useToast';
import GenericTable, { Column } from '@/components/GenericTable';
import Modal from '@/components/Modal';
import { ToastContainer } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useCreateStudentMutation, useUpdateStudentMutation, useDeleteStudentMutation, useStudents } from '../hooks/useStudents';

const initialFormData: StudentInput = {
  firstName: '',
  lastName: '',
  admissionNumber: '',
  className: '',
  section: '',
  gender: '',
  dateOfBirth: null,
  email: '',
  phone: '',
}


const formFields: FormField[] = [
  { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', required: true },
  { name: 'admissionNumber', label: 'Roll/Admission No', type: 'text', placeholder: 'STU-001' },
  { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }] },
  { name: 'className', label: 'Class', type: 'text', placeholder: 'Grade 10A', required: true },
  { name: 'section', label: 'Section', type: 'text', placeholder: 'A' },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'email', label: 'Email Address', type: 'email' },
  { name: 'phone', label: 'Student Phone', type: 'tel' },
  { name: 'parent', label: 'Parent Name', type: 'text' },
  { name: 'parentPhone', label: 'Parent Phone', type: 'tel' },
  { name: 'address', label: 'Address', type: 'textarea', colSpan: 2 },
];

export default function StudentsView() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { toasts, remove, success, error: showError } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All Classes');
  const [filterSection, setFilterSection] = useState('All Sections');
  const [filterShift, setFilterShift] = useState('All Shifts');
  const [filterBadge, setFilterBadge] = useState('All Badges');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const createMutation = useCreateStudentMutation();
  const updateMutation = useUpdateStudentMutation();
  const deleteMutation = useDeleteStudentMutation();
  const [formData, setFormData] = useState<StudentInput>(initialFormData);
  const { data = [], isLoading, error } = useStudents();

  const resetForm = () => {
    setSelectedStudent(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (payload: StudentInput) => {
    try {
      if (selectedStudent) {
        await updateMutation.mutateAsync({ id: selectedStudent.id, payload });
        success('Student updated successfully.');
      } else {
        await createMutation.mutateAsync(payload);
        success('Student saved successfully.');
      }

      resetForm();
    } catch (mutationError) {
      showError(mutationError instanceof Error ? mutationError.message : 'Unable to save student.');
    }
  };


  const handleDelete = async (item: Student) => {
    const confirmed = await confirm(`This will permanently remove ${item.firstName} ${item.lastName} from the system.`, 'Delete Student?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(item.id);
      success('Student deleted successfully.');
      if (selectedStudent?.id === item.id) {
        resetForm();
      }
    } catch (mutationError) {
      showError(mutationError instanceof Error ? mutationError.message : 'Unable to delete student.');
    }
  };


  const escapeCsv = (value: string | number | undefined) => {
    const text = String(value ?? '');
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const downloadFile = (fileName: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const csv = [
      ['Admission Number', 'Name', 'Class', 'Section', 'Gender', 'Date of Birth', 'Status'],
      ...filteredStudents.map((student) => [student.rollNo, `${student.firstName} ${student.lastName}`, student.className, student.section ?? '', student.gender ?? '', student.dateOfBirth ?? '', student.status]),
    ].map((row) => row.map(escapeCsv).join(',')).join('\n');

    downloadFile('students.csv', csv, 'text/csv;charset=utf-8');
    success('Student CSV exported.');
  };

  const handleExportPdf = () => {
    const rows = filteredStudents.map((student) => `
          <tr>
            <td>${student.rollNo}</td>
            <td>${`${student.firstName} ${student.lastName}`}</td>
            <td>${student.className}</td>
            <td>${student.section ?? ''}</td>
            <td>${student.gender ?? ''}</td>
            <td>${student.status}</td>
          </tr>`).join('');

    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      showError('Popup blocked. Please allow popups to export PDF.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Students Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            h1 { margin: 0 0 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Student Management</h1>
          <table>
            <thead>
              <tr>
                <th>Admission Number</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Gender</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="6">No students found</td></tr>'}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    success('PDF export opened in print view.');
  };

  const parseCsvLine = (line: string) => {
    const values: string[] = [];
    let current = '';
    let quoted = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const next = line[index + 1];

      if (char === '"' && quoted && next === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === ',' && !quoted) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  };

  const handleImportCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        showError('CSV file must include a header row and at least one student.');
        return;
      }

      const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ''));
      const rows = lines.slice(1).map(parseCsvLine);
      let imported = 0;

      for (const row of rows) {
        const value = (...names: string[]) => {
          const index = headers.findIndex((header) => names.includes(header));
          return index >= 0 ? row[index] : '';
        };
        const fullName = value('name', 'studentname');
        const [firstNameFromFull, ...lastNameParts] = fullName.split(' ').filter(Boolean);
        const payload = {
          firstName: value('firstname') || firstNameFromFull,
          lastName: value('lastname') || lastNameParts.join(' ') || '-',
          admissionNumber: value('admissionnumber', 'rollno', 'roll', 'id'),
          className: value('classname', 'class'),
          section: value('section'),
          gender: value('gender'),
          dateOfBirth: value('dateofbirth', 'dob') || null,
          active: value('status').toLowerCase() !== 'inactive',
        };

        if (!payload.firstName || !payload.className) {
          continue;
        }

        await createMutation.mutateAsync(payload);
        imported += 1;
      }

      success(`${imported} student${imported === 1 ? '' : 's'} imported.`);
    } catch (err: any) {
      showError(err.message || 'Unable to import students.');
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      admissionNumber: student.admissionNumber ?? student.rollNo,
      className: student.className,
      section: student.section ?? '',
      gender: student.gender ?? '',
      dateOfBirth: student.dateOfBirth ?? null,
      email: student.email ?? '',
      phone: student.phone ?? '',
      parent: student.parent ?? '',
      parentPhone: student.parentPhone ?? '',
      address: student.address ?? '',
      active: student.status === 'Active',
    });
  };

  const columns: Column<Student>[] = [
    { header: 'Student Info', accessor: (student) => <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2D6CDF] font-bold">{student.firstName.charAt(0)}</div><div><div className="font-bold text-gray-900">{`${student.firstName} ${student.lastName}`}</div><div className="text-xs text-gray-400">ID: {student.rollNo}</div></div></div> },
    { header: 'Class & Section', accessor: (student) => <div><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold mr-1">{student.className}</span>{student.section && <span className="px-2 py-1 bg-teal-50 text-teal-600 rounded text-xs font-bold">{student.section}</span>}</div> },
    { header: 'Shift', accessor: () => <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs font-bold">Day</span> },
    { header: 'Badge', accessor: () => <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-bold">Resident</span> },
    { header: 'Contact', accessor: (student) => <div className="space-y-1"><div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium"><Phone className="w-3 h-3 text-gray-400" /><span>{student.phone || student.parentPhone || 'N/A'}</span></div></div> },
  ];

  const filteredStudents = data.filter((student) => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'All Classes' || student.className === filterClass;
    const matchesSection = filterSection === 'All Sections' || student.section === filterSection;
    return matchesSearch && matchesClass && matchesSection;
  });

  const customFilters = (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold border border-indigo-100 shrink-0"><Filter className="w-4 h-4" /> Filters</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 w-full">
        <select value={filterClass} onChange={(event) => setFilterClass(event.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium">
          <option>All Classes</option>
          <option>Grade 1</option>
          <option>Grade 2</option>
        </select>
        <select value={filterSection} onChange={(event) => setFilterSection(event.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium">
          <option>All Sections</option>
          <option>A</option>
          <option>B</option>
        </select>
        <select value={filterShift} onChange={(event) => setFilterShift(event.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium">
          <option>All Shifts</option>
          <option>Morning</option>
          <option>Day</option>
        </select>
        <select value={filterBadge} onChange={(event) => setFilterBadge(event.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium">
          <option>All Badges</option>
          <option>Resident</option>
          <option>Non-Resident</option>
        </select>
        <div className="relative w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by name, ID..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 text-sm font-medium" />
          </div>
          <button onClick={() => { setSearchTerm(''); setFilterClass('All Classes'); setFilterSection('All Sections'); setFilterShift('All Shifts'); setFilterBadge('All Badges'); }} className="p-2.5 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );

  const topActions = (
    <>
      <input ref={importInputRef} type="file" accept=".csv,text/csv" onChange={handleImportCsv} className="hidden" />
      <button onClick={() => importInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all text-sm shadow-md shadow-amber-500/20"><Upload className="w-4 h-4" /> Bulk Import</button>
      <button onClick={handleExportCsv} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-md shadow-emerald-600/20"><Download className="w-4 h-4" /> Export CSV</button>
      <button onClick={handleExportPdf} className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all text-sm shadow-md shadow-rose-600/20"><FileText className="w-4 h-4" /> Export PDF</button>
    </>
  );

  const stats = [
    { label: 'Total Students', value: data.length },
    { label: 'Active', value: data.filter((student) => student.status === 'Active').length, color: 'text-green-600' },
    { label: 'Inactive', value: data.filter((student) => student.status === 'Inactive').length, color: 'text-red-600' },
    { label: 'Avg Attendance', value: '94%', color: 'text-blue-600' },
  ];

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Unable to load students.'}
        </div>
      )}

      <GenericTable
        title="Student Management"
        description="View and manage student records, admissions and information"
        stats={stats}
        data={filteredStudents}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        customFilters={customFilters}
        topActions={topActions}
        onAdd={() => { setModalMode('add'); setSelectedStudent(null); setShowModal(true); }}
        addLabel="Add Student"
        onView={(student) => navigate(`/students/${student.id}`)}
        onEdit={(student) => { handleEdit(student); setModalMode('edit'); setShowModal(true); }}
        onDelete={handleDelete}
        isLoading={isLoading && data.length === 0}
        canAdd={auth?.role.toLowerCase() === 'admin'}
        canEdit={auth?.role.toLowerCase() === 'admin'}
        canDelete={auth?.role.toLowerCase() === 'admin'}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'add' ? 'Register New Student' : 'Edit Student Details'}>
        <GenericForm fields={formFields} 
          initialData={formData}
          onSubmit={handleSubmit} 
          onCancel={() => setShowModal(false)} 
          submitLabel={modalMode === 'add' ? 'Register Student' : 'Update Student'} 
          />
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Student Profile Details">
        {selectedStudent && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-[#2D6CDF] font-bold text-4xl border border-gray-100">{selectedStudent.firstName.charAt(0)}</div>
              <div>
                <h3 className="text-gray-900 font-bold text-2xl mb-1">{`${selectedStudent.firstName} ${selectedStudent.lastName}`}</h3>
                <p className="text-[#2D6CDF] font-bold uppercase tracking-wider text-sm">{selectedStudent.status} Student</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: User, label: 'Admission No', value: selectedStudent.rollNo },
                { icon: BookOpen, label: 'Current Class', value: selectedStudent.className },
                { icon: Calendar, label: 'Date of Birth', value: formatDateForDisplay(selectedStudent.dateOfBirth) },
                { icon: User, label: 'Gender', value: selectedStudent.gender || 'N/A' },
                { icon: Mail, label: 'Email Address', value: selectedStudent.email || 'N/A' },
                { icon: Phone, label: 'Phone Number', value: selectedStudent.phone || 'N/A' },
                { icon: User, label: 'Parent/Guardian', value: selectedStudent.parent || 'N/A' },
                { icon: Phone, label: 'Parent Phone', value: selectedStudent.parentPhone || 'N/A' },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block">{item.label}</label>
                    <p className="text-gray-900 font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
              <div className="md:col-span-2 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><MapPin className="w-5 h-5" /></div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block">Residential Address</label>
                  <p className="text-gray-900 font-bold bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">{selectedStudent.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all">Close</button>
              <button onClick={() => { setShowViewModal(false); setModalMode('edit'); setShowModal(true); }} className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20">Edit Student</button>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmDialog isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} confirmLabel={confirmState.confirmLabel} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}
