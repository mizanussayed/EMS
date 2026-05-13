import { useMemo, useRef, useState } from 'react';
import { BookOpen, GraduationCap, Award, Users, FileText, Upload, Download, X } from 'lucide-react';
import { useToast, useConfirm } from '@/hooks/useToast';
import GenericTable, { type Column } from '@/components/GenericTable';
import Modal from '@/components/Modal';
import GenericForm, { type FormField } from '@/components/GenericForm';
import { ToastContainer } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useClasses } from '@/features/classes/hooks/useClasses';
import { useTeachers } from '@/features/teachers/hooks/useTeachers';
import type { Subject, SubjectInput } from '../model/subject.types';
import { useCreateSubjectMutation, useDeleteSubjectMutation, useSubjects, useUpdateSubjectMutation } from '../hooks/useSubjects';

const buildFormFields = (teacherOptions: FormField['options'], classOptions: FormField['options']): FormField[] => [
  { name: 'name', label: 'Subject Name', type: 'text', placeholder: 'e.g., Mathematics', required: true },
  { name: 'code', label: 'Subject Code', type: 'text', placeholder: 'e.g., MATH-10', required: true },
  { name: 'teacher', label: 'Assigned Teacher', type: 'select', options: teacherOptions },
  { name: 'classes', label: 'Classes', type: 'select', options: classOptions },
  { name: 'credits', label: 'Credits', type: 'number', placeholder: '3' },
  { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Core', value: 'Core' }, { label: 'Elective', value: 'Elective' }] },
];

export default function SubjectsView() {
  const { auth } = useAuth();
  const { data = [], isLoading } = useSubjects();
  const { data: teachers = [], error: teachersError } = useTeachers();
  const { data: classes = [], error: classesError } = useClasses();
  const createSubjectMutation = useCreateSubjectMutation();
  const updateSubjectMutation = useUpdateSubjectMutation();
  const deleteSubjectMutation = useDeleteSubjectMutation();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const teacherOptions = useMemo(
    () => teachers.map((teacher) => ({ label: teacher.name, value: teacher.name })),
    [teachers]
  );

  const classOptions = useMemo(
    () =>
      classes.map((item) => {
        const label = item.section ? `${item.name} - ${item.section}` : item.name;
        return { label, value: label };
      }),
    [classes]
  );

  const formFields = useMemo(
    () => buildFormFields(teacherOptions, classOptions),
    [classOptions, teacherOptions]
  );

  const handleFileChange = (file: File | null) => {
    setImportFile(file);
  };

  const clearImportFile = () => {
    setImportFile(null);
    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  };

  const downloadSampleCsv = () => {
    const sample = 'Subject Name,Code,Credits,Type,Teacher\nMathematics,MATH-10,3,Core,John Doe\nEnglish,ENG-10,3,Core,Jane Smith';
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'subjects-sample.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = async () => {
    if (!importFile) return error('Select a CSV file first');
    const text = await importFile.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) return error('Empty CSV');
    const header = lines[0].split(',').map((value) => value.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => line.split(',').map((value) => value.trim()));

    const items = rows.map((columns) => {
      const obj: any = {};
      columns.forEach((value, index) => {
        const key = header[index] || `col${index}`;
        obj[key] = value;
      });
      return {
        name: obj['subject name'] || obj['name'] || obj['subject'] || '',
        code: obj['code'] || '',
        credits: Number(obj['credits'] || obj['credit'] || 0),
        type: obj['type'] || 'Core',
        teacher: obj['teacher'] || '',
      };
    }).filter((item) => item.name);

    if (items.length === 0) return error('No valid rows to import');

    try {
      for (const item of items) {
        await createSubjectMutation.mutateAsync(item as SubjectInput);
      }
      clearImportFile();
      success(`Imported ${items.length} subjects`);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (modalMode === 'add') {
        await createSubjectMutation.mutateAsync(data);
      } else {
        await updateSubjectMutation.mutateAsync({ id: selectedSubject?.id ?? 0, payload: data });
      }
      setShowModal(false);
      success(modalMode === 'add' ? 'Subject added successfully.' : 'Subject updated successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (subject: Subject) => {
    const ok = await confirm(`This will permanently remove ${subject.name} from the curriculum.`, 'Delete Subject?');
    if (!ok) return;
    try {
      await deleteSubjectMutation.mutateAsync(subject.id);
      success('Subject deleted successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const columns: Column<Subject>[] = [
    { header: 'Subject Code', accessor: (subject) => <span className="font-bold text-gray-900">{subject.code}</span> },
    { header: 'Subject Name', accessor: (subject) => <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#2D6CDF]" /><span className="text-gray-900 font-medium">{subject.name}</span></div> },
    { header: 'Teacher', accessor: (subject) => <div className="flex items-center gap-2 text-gray-600"><GraduationCap className="w-4 h-4 text-gray-400" /><span>{subject.teacher || 'Not Assigned'}</span></div> },
    { header: 'Classes', accessor: 'classes' },
    { header: 'Students', accessor: 'students' },
    { header: 'Credits', accessor: 'credits' },
    { header: 'Type', accessor: (subject) => <span className={`px-3 py-1 rounded-full text-xs font-bold ${subject.type === 'Core' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{subject.type}</span> },
  ];

  const stats = [
    { label: 'Total Subjects', value: data.length },
    { label: 'Core Subjects', value: data.filter((subject) => subject.type === 'Core').length, color: 'text-blue-600' },
    { label: 'Electives', value: data.filter((subject) => subject.type === 'Elective').length, color: 'text-purple-600' },
    { label: 'Teachers', value: new Set(data.map((subject) => subject.teacher).filter(Boolean)).size, color: 'text-green-600' },
  ];

  const filteredSubjects = data.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.teacher?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setModalMode('edit');
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {(teachersError || classesError) && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {teachersError instanceof Error
            ? teachersError.message
            : classesError instanceof Error
              ? classesError.message
              : 'Unable to load subject lookups.'}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-right lg:justify-between">
          <input
            ref={importInputRef}
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => handleFileChange(event.target.files?.[0] || null)}
            className="hidden"
          />
          <label
            htmlFor="csv-upload"
            className="flex min-w-0 w-1 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 transition-all hover:border-[#2D6CDF] hover:bg-blue-50/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2D6CDF] shadow-sm">
              <FileText className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-gray-900">
                {importFile?.name || 'Choose subject CSV'}
              </span>
              <span className="block text-xs font-medium text-gray-500">
                {importFile ? `${Math.max(1, Math.round(importFile.size / 1024))} KB ready to import` : 'CSV files only'}
              </span>
            </span>
            {importFile && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  clearImportFile();
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-gray-700"
                title="Clear file"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={importCSV}
              disabled={!importFile || createSubjectMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2D6CDF] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#2D6CDF]/20 transition-all hover:bg-[#1a4ba8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
            <button
              onClick={downloadSampleCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
            >
              <Download className="h-4 w-4 text-gray-400" />
              Sample CSV
            </button>
          </div>
        </div>
      </div>

      <GenericTable
        title="Subject Management"
        description="Manage subjects and curriculum"
        stats={stats}
        data={filteredSubjects}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => { setModalMode('add'); setSelectedSubject(null); setShowModal(true); }}
        addLabel="Add Subject"
        onView={(subject) => { setSelectedSubject(subject); setShowViewModal(true); }}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        isLoading={isLoading}
        canAdd={auth?.role.toLowerCase() === 'admin'}
        canEdit={auth?.role.toLowerCase() === 'admin'}
        canDelete={auth?.role.toLowerCase() === 'admin'}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'add' ? 'Add New Subject' : 'Edit Subject'}>
        <GenericForm fields={formFields} initialData={selectedSubject || { type: 'Core', credits: 3 }} onSubmit={handleSubmit} onCancel={() => setShowModal(false)} submitLabel={modalMode === 'add' ? 'Add Subject' : 'Save Changes'} />
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Subject Details">
        {selectedSubject && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-[#2D6CDF] font-bold text-4xl border border-gray-100">
                {selectedSubject.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-2xl mb-1">{selectedSubject.name}</h3>
                <p className="text-[#2D6CDF] font-bold uppercase tracking-wider text-sm">{selectedSubject.code}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: BookOpen, label: 'Subject Name', value: selectedSubject.name },
                { icon: GraduationCap, label: 'Assigned Teacher', value: selectedSubject.teacher || 'Not Assigned' },
                { icon: Users, label: 'Total Students', value: selectedSubject.students || 0 },
                { icon: Award, label: 'Credits', value: selectedSubject.credits },
                { icon: Award, label: 'Subject Type', value: selectedSubject.type },
                { icon: Users, label: 'Assigned Classes', value: selectedSubject.classes || 'None' },
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
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all">Close</button>
              {auth?.role.toLowerCase() === 'admin' && (
                <button onClick={() => { setShowViewModal(false); handleEditClick(selectedSubject); }} className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20">
                  Edit Subject
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmDialog isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} confirmLabel={confirmState.confirmLabel} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}
