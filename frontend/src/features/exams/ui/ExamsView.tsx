import { useState } from 'react';
import { FileText, Calendar, Clock, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import GenericTable, { type Column } from '@/components/ui/GenericTable';
import Modal from '@/components/ui/Modal';
import GenericForm, { type FormField } from '@/components/ui/GenericForm';
import { ToastContainer } from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useConfirm, useToast } from '@/hooks/useToast';
import { formatDateForAPI, formatDateForDisplay, formatDateForInput } from '@/utils/dateUtils';
import { downloadClassWiseResults, downloadExamSummary, downloadStudentWiseResults, downloadTranscriptCard } from '@/app/utils/examReports';
import { useDeleteExamMutation, useExamResults, useExams, useCreateExamMutation, useUpdateExamMutation } from '../hooks/useExams';
import type { Exam, ExamInput, ExamResult } from '../model/exam.types';

const formFields: FormField[] = [
  { name: 'title', label: 'Exam Title', type: 'text', placeholder: 'e.g., Annual Final Term 2025', required: true, colSpan: 2 },
  { name: 'type', label: 'Exam Type', type: 'select', options: [
    { label: 'Mid-term', value: 'Mid-term' },
    { label: 'Final', value: 'Final' },
    { label: 'Unit Test', value: 'Unit Test' },
    { label: 'Quiz', value: 'Quiz' },
  ], required: true },
  { name: 'className', label: 'Class / Section', type: 'text', placeholder: 'e.g., Grade 10A' },
  { name: 'startDate', label: 'Start Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date', type: 'date', required: true },
  { name: 'status', label: 'Status', type: 'select', options: [
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Completed', value: 'Completed' },
  ] },
];

export default function ExamsView() {
  const { auth } = useAuth();
  const { toasts, remove, success, error: showError } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const examsQuery = useExams();
  const createMutation = useCreateExamMutation();
  const updateMutation = useUpdateExamMutation();
  const deleteMutation = useDeleteExamMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examResultsQueryExamId, setExamResultsQueryExamId] = useState<number | null>(null);
  const examResultsQuery = useExamResults(examResultsQueryExamId);

  const exams = examsQuery.data ?? [];
  const examResults = examResultsQuery.data ?? [];

  const handleSubmit = async (data: ExamInput) => {
    try {
      const payload: ExamInput = {
        ...data,
        startDate: formatDateForAPI(data.startDate),
        endDate: formatDateForAPI(data.endDate),
      };

      if (modalMode === 'add') {
        await createMutation.mutateAsync(payload);
        success('Exam scheduled successfully.');
      } else if (selectedExam) {
        await updateMutation.mutateAsync({ id: selectedExam.id, payload });
        success('Exam updated successfully.');
      }

      setShowModal(false);
    } catch (mutationError) {
      showError(mutationError instanceof Error ? mutationError.message : 'Unable to save exam.');
    }
  };

  const handleDelete = async (exam: Exam) => {
    const ok = await confirm(`This will permanently remove the exam "${exam.title}" from the system.`, 'Delete Exam?');
    if (!ok) return;

    try {
      await deleteMutation.mutateAsync(exam.id);
      success('Exam deleted successfully.');
    } catch (mutationError) {
      showError(mutationError instanceof Error ? mutationError.message : 'Unable to delete exam.');
    }
  };

  const columns: Column<Exam>[] = [
    {
      header: 'Exam Details',
      accessor: (exam) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2D6CDF] font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-gray-900">{exam.title}</div>
            <div className="text-xs text-gray-400">{exam.type}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Class',
      accessor: (exam) => (
        <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold border border-gray-100">
          {exam.className || 'General'}
        </span>
      ),
    },
    {
      header: 'Timeline',
      accessor: (exam) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-900 font-bold">{formatDateForDisplay(exam.startDate)}</div>
            <div className="text-xs text-gray-400">to {new Date(exam.endDate).toLocaleDateString()}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (exam) => (
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
          exam.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
          exam.status === 'Ongoing' ? 'bg-orange-50 text-orange-700 border-orange-100 animate-pulse' :
          'bg-blue-50 text-blue-700 border-blue-100'
        }`}>
          {exam.status}
        </span>
      ),
    },
  ];

  const stats = [
    { label: 'Total Exams', value: exams.length },
    { label: 'Scheduled', value: exams.filter((exam) => exam.status === 'Scheduled').length, color: 'text-blue-600' },
    { label: 'Ongoing', value: exams.filter((exam) => exam.status === 'Ongoing').length, color: 'text-orange-600' },
    { label: 'Completed', value: exams.filter((exam) => exam.status === 'Completed').length, color: 'text-green-600' },
  ];

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exam.className?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (exam: Exam) => {
    const formattedExam = {
      ...exam,
      startDate: formatDateForInput(exam.startDate),
      endDate: formatDateForInput(exam.endDate),
    };
    setSelectedExam(formattedExam);
    setModalMode('edit');
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <GenericTable
        title="Exam Management"
        description="Schedule and track academic evaluations"
        stats={stats}
        data={filteredExams}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => { setModalMode('add'); setSelectedExam(null); setShowModal(true); }}
        addLabel="Schedule Exam"
        onView={(exam) => { setSelectedExam(exam); setExamResultsQueryExamId(exam.id); setShowViewModal(true); }}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        isLoading={examsQuery.isLoading && exams.length === 0}
        canAdd={auth?.role === 'admin'}
        canEdit={auth?.role === 'admin'}
        canDelete={auth?.role === 'admin'}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Schedule New Exam' : 'Edit Exam Schedule'}
      >
        <GenericForm
          fields={formFields}
          initialData={selectedExam || { type: 'Mid-term', status: 'Scheduled' }}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          submitLabel={modalMode === 'add' ? 'Schedule Exam' : 'Save Changes'}
        />
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Exam Details"
      >
        {selectedExam && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center text-[#2D6CDF] mx-auto">
                <FileText className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-2xl mb-1">{selectedExam.title}</h3>
                <p className="text-[#2D6CDF] font-bold uppercase tracking-wider text-sm">{selectedExam.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: FileText, label: 'Exam Title', value: selectedExam.title },
                { icon: Clock, label: 'Exam Type', value: selectedExam.type },
                { icon: Calendar, label: 'Class / Section', value: selectedExam.className || 'General' },
                { icon: CheckCircle, label: 'Current Status', value: selectedExam.status },
                { icon: Calendar, label: 'Start Date', value: formatDateForDisplay(selectedExam.startDate) },
                { icon: Calendar, label: 'End Date', value: formatDateForDisplay(selectedExam.endDate) },
                { icon: FileText, label: 'Total Results', value: examResults.length.toString() },
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

            {examResultsQuery.isLoading && (
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="text-blue-700 font-bold">Loading exam results...</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all">Close</button>
              {examResults.length > 0 && (
                <div className="flex gap-2">
                  <button onClick={() => downloadClassWiseResults(selectedExam, examResults as ExamResult[])} className="px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center gap-2" title="Download results grouped by class">
                    <Download className="w-4 h-4" />
                    Class Results
                  </button>
                  <button onClick={() => downloadStudentWiseResults(selectedExam, examResults as ExamResult[])} className="px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-bold hover:bg-green-100 transition-all flex items-center gap-2" title="Download results grouped by student">
                    <Download className="w-4 h-4" />
                    Student Results
                  </button>
                  <button onClick={() => downloadTranscriptCard(selectedExam, examResults as ExamResult[])} className="px-4 py-2.5 bg-purple-50 text-purple-700 rounded-xl font-bold hover:bg-purple-100 transition-all flex items-center gap-2" title="Download transcript cards">
                    <Download className="w-4 h-4" />
                    Transcript
                  </button>
                  <button onClick={() => downloadExamSummary(selectedExam, examResults as ExamResult[])} className="px-4 py-2.5 bg-orange-50 text-orange-700 rounded-xl font-bold hover:bg-orange-100 transition-all flex items-center gap-2" title="Download summary report">
                    <Download className="w-4 h-4" />
                    Summary
                  </button>
                </div>
              )}
              {auth?.role === 'admin' && (
                <button onClick={() => { setShowViewModal(false); handleEditClick(selectedExam); }} className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20">
                  Edit Exam
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
