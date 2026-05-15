import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Clock, Edit, User, MapPin, Plus, Printer, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast, useConfirm } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useClasses } from '@/features/classes/hooks/useClasses';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { useTeachers } from '@/features/teachers/hooks/useTeachers';
import type { StudentClass, TimetableEntry, TimetableInput } from '../model/timetable.types';
import { useCreateTimetableMutation, useDeleteTimetableMutation, useTimetableClasses, useTimetableEntries, useUpdateTimetableMutation } from '../hooks/useTimetable';
import { BUTTON_STYLES, INPUT_STYLES } from '@/styles/componentStyles';

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

const splitClassNames = (classes: string) =>
  classes
    .split(/[,;|/]/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map((value) => Number(value));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return (hours * 60) + minutes;
};

const addHour = (time: string) => {
  const minutes = toMinutes(time);
  if (!Number.isFinite(minutes) || minutes === Number.MAX_SAFE_INTEGER) {
    return '09:00';
  }

  const next = Math.min(minutes + 60, (23 * 60) + 59);
  const hoursPart = String(Math.floor(next / 60)).padStart(2, '0');
  const minutesPart = String(next % 60).padStart(2, '0');
  return `${hoursPart}:${minutesPart}`;
};

type TimetableFormData = Omit<TimetableInput, 'className'>;

const emptyTimetableForm: TimetableFormData = {
  subjectName: '',
  teacherName: '',
  dayOfWeek: 'Monday',
  startTime: '08:00',
  endTime: '09:00',
  room: '',
};

export default function TimetableView() {
  const { auth } = useAuth();
  const { data: classesData = [] } = useTimetableClasses();
  const { data: schoolClasses = [], error: classesError } = useClasses();
  const { data: subjects = [], error: subjectsError } = useSubjects();
  const { data: teachers = [], error: teachersError } = useTeachers();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [selectedClass, setSelectedClass] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [formData, setFormData] = useState<TimetableFormData>(emptyTimetableForm);
  const isAdmin = auth?.role.toLowerCase() === 'admin';
  const filteredSubjects = useMemo(() => {
    const normalizedSelectedClass = selectedClass.trim().toLowerCase();

    debugger;
    if (!normalizedSelectedClass) {
      return subjects;
    }
 

    return subjects.filter((subject) => {
      const subjectClasses = subject.classes?.trim();
      if (!subjectClasses) {
        return true;
      }

      const allowedClasses = splitClassNames(subjectClasses);
      return allowedClasses.some((className) => className === normalizedSelectedClass);
    });
  }, [selectedClass, subjects]);

  const subjectOptions = useMemo(
    () => filteredSubjects.map((subject) => ({ label: `${subject.name} (${subject.code})`, value: subject.name })),
    [filteredSubjects]
  );

  const subjectTeacherByName = useMemo(
    () => new Map(filteredSubjects.map((subject) => [subject.name, subject.teacher ?? ''])),
    [filteredSubjects]
  );

  const teacherOptions = useMemo(
    () => teachers.map((teacher) => ({ label: teacher.name, value: teacher.name })),
    [teachers]
  );

  const mappedTeacherName = subjectTeacherByName.get(formData.subjectName) ?? '';
  const teacherSelectOptions = useMemo(() => {
    if (!mappedTeacherName || teacherOptions.some((teacher) => teacher.value === mappedTeacherName)) {
      return teacherOptions;
    }

    return [{ label: mappedTeacherName, value: mappedTeacherName }, ...teacherOptions];
  }, [mappedTeacherName, teacherOptions]);
  const classes = useMemo(() => {
    const classNames = schoolClasses.length > 0
      ? schoolClasses.map((item) => item.name)
      : classesData.map((student: StudentClass) => student.className);

    return Array.from(new Set(classNames.filter(Boolean) as string[])).sort();
  }, [classesData, schoolClasses]);
  const selectedSchoolClass = useMemo(
    () => schoolClasses.find((item) => item.name === selectedClass),
    [schoolClasses, selectedClass]
  );
  const mappedRoom = selectedSchoolClass?.room?.trim() ?? '';
  const { data: entries = [], isLoading } = useTimetableEntries(selectedClass);
  const timeSlots = useMemo(() => {
    const uniqueStartTimes = Array.from(new Set(entries.map((entry) => entry.startTime).filter(Boolean)));
    if (uniqueStartTimes.length === 0) {
      return ['08:00'];
    }

    return uniqueStartTimes.sort((left, right) => toMinutes(left) - toMinutes(right));
  }, [entries]);
  const suggestedTimes = useMemo(() => {
    const allTimes = new Set<string>([...timeSlots, ...entries.map((entry) => entry.endTime).filter(Boolean)]);
    return Array.from(allTimes).sort((left, right) => toMinutes(left) - toMinutes(right));
  }, [entries, timeSlots]);
  const createTimetableMutation = useCreateTimetableMutation(selectedClass);
  const updateTimetableMutation = useUpdateTimetableMutation(selectedClass);
  const deleteTimetableMutation = useDeleteTimetableMutation(selectedClass);

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]);
    }
  }, [classes, selectedClass]);

  useEffect(() => {
    if (showModal && modalMode === 'add' && mappedRoom) {
      setFormData((current) => ({ ...current, room: mappedRoom }));
    }
  }, [mappedRoom, modalMode, showModal]);

  useEffect(() => {
    if (!showModal) {
      return;
    }

    if (selectedEntry) {
      setFormData({
        subjectName: selectedEntry.subjectName,
        teacherName: selectedEntry.teacherName,
        dayOfWeek: selectedEntry.dayOfWeek,
        startTime: selectedEntry.startTime,
        endTime: selectedEntry.endTime,
        room: selectedEntry.room,
      });
      return;
    }
  }, [selectedEntry, showModal]);

  useEffect(() => {
    if (selectedEntry || !showModal) {
      return;
    }

    if (!formData.subjectName) {
      return;
    }

    const isCurrentSubjectVisible = filteredSubjects.some((subject) => subject.name === formData.subjectName);
    if (!isCurrentSubjectVisible) {
      setFormData((current) => ({
        ...current,
        subjectName: '',
        teacherName: '',
      }));
    }
  }, [filteredSubjects, formData.subjectName, selectedEntry, showModal]);

  const handleSubjectChange = (subjectName: string) => {
    const teacherName = subjectTeacherByName.get(subjectName) ?? '';
    setFormData((current) => ({
      ...current,
      subjectName,
      teacherName,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedClass) {
      error('Select a class before creating a timetable entry.');
      return;
    }
    if (!formData.subjectName || !formData.teacherName || !formData.dayOfWeek || !formData.startTime || !formData.endTime || !formData.room.trim()) {
      error('Complete all timetable fields before saving.');
      return;
    }
    if (toMinutes(formData.endTime) <= toMinutes(formData.startTime)) {
      error('End time must be later than start time.');
      return;
    }

    try {
      const payload: TimetableInput = { ...formData, room: formData.room.trim(), className: selectedClass };
      if (modalMode === 'add') {
        await createTimetableMutation.mutateAsync(payload);
        success('Timetable entry added successfully.');
      } else if (selectedEntry) {
        await updateTimetableMutation.mutateAsync({ id: selectedEntry.id, payload });
        success('Timetable entry updated successfully.');
      }
      setShowModal(false);
      setSelectedEntry(null);
      setFormData(emptyTimetableForm);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm('This timetable entry will be permanently removed.', 'Delete Entry?');
    if (!ok) return;
    try {
      await deleteTimetableMutation.mutateAsync(id);
      success('Timetable entry deleted successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const openCreateModal = (dayOfWeek = 'Monday', startTime = '08:00') => {
    const endTime = addHour(startTime);

    setModalMode('add');
    setSelectedEntry(null);
    setFormData({
      ...emptyTimetableForm,
      dayOfWeek,
      startTime,
      endTime,
      room: mappedRoom,
    });
    setShowModal(true);
  };

  const handleEditClick = (entry: TimetableEntry) => { setSelectedEntry(entry); setModalMode('edit'); setShowModal(true); };
  const handleAddClick = () => openCreateModal();
  const getEntryForSlot = (day: string, time: string) => entries.find((entry) => entry.dayOfWeek === day && entry.startTime === time);

  const escapeHtml = (value: string | number | undefined) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const handlePrint = () => {
    if (!selectedClass) {
      error('Select a class before printing.');
      return;
    }

    const rows = timeSlots.map((time) => `
      <tr>
        <th>${escapeHtml(time)}</th>
        ${days.map((day) => {
          const entry = getEntryForSlot(day, time);
          return `<td>${entry ? `
            <strong>${escapeHtml(entry.subjectName)}</strong>
            <span>${escapeHtml(entry.teacherName)}</span>
            <small>${escapeHtml(entry.startTime)} - ${escapeHtml(entry.endTime)} | Room ${escapeHtml(entry.room)}</small>
          ` : ''}</td>`;
        }).join('')}
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      error('Popup blocked. Please allow popups to print the timetable.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${escapeHtml(selectedClass)} Timetable</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
            h1 { margin: 0 0 4px; font-size: 24px; }
            p { margin: 0 0 20px; color: #4b5563; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            th, td { border: 1px solid #d1d5db; padding: 10px; vertical-align: top; min-height: 72px; }
            thead th { background: #f3f4f6; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
            tbody th { width: 80px; background: #f9fafb; }
            strong, span, small { display: block; }
            strong { color: #1d4ed8; margin-bottom: 6px; }
            span { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
            small { color: #4b5563; font-size: 11px; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(selectedClass)} Timetable</h1>
          <p>${mappedRoom ? `Default room: ${escapeHtml(mappedRoom)}` : 'Academic Schedule Planner'}</p>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                ${days.map((day) => `<th>${escapeHtml(day)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <SectionHeader
          icon={Clock}
          title="Timetable Management"
          subtitle="Create and manage class schedules"
        />
      </div>
      {classesError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {classesError instanceof Error ? classesError.message : 'Unable to load classes.'}
        </div>
      )}
      {(subjectsError || teachersError) && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {subjectsError instanceof Error
            ? subjectsError.message
            : teachersError instanceof Error
              ? teachersError.message
              : 'Unable to load timetable lookups.'}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-end mb-8 gap-4">
        <div className="flex gap-3">
          {classes.length > 0 && (
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all font-bold text-gray-700 shadow-sm">
              <option value="">Select Class</option>
              {classes.map((className) => <option key={className} value={className}>{className}</option>)}
            </select>
          )}
          {selectedClass && (
            <button onClick={handlePrint} className={`${BUTTON_STYLES.success} flex items-center justify-center gap-2`}>
              <Printer className="w-5 h-5 text-white" />
              Print
            </button>
          )}
          {isAdmin && selectedClass && (
            <button onClick={handleAddClick}  className={`${BUTTON_STYLES.primary} flex items-center justify-center gap-2`}>
              <Plus className="w-5 h-5" />
              Add Entry
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-3 text-xs font-black uppercase text-gray-400 tracking-widest border-r border-gray-100">Time</th>
                {days.map((day) => <th key={day} className="p-6 text-xs font-black uppercase text-gray-700 tracking-widest text-center">{day}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeSlots.map((time, index) => (
                <tr key={index} className="group">
                  <td className="text-center border-r border-gray-100 bg-gray-50/20">
                    <div className="flex flex-col items-center">
                      <Clock className="w-4 h-4 text-[#2D6CDF] mb-1" />
                      <span className="text-gray-900 font-black text-sm">{time}</span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const entry = getEntryForSlot(day, time);
                    return (
                      <td key={day} className="p-3 align-top min-w-[200px]">
                        {entry ? (
                          <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100 hover:bg-blue-50 hover:shadow-lg transition-all group/card relative cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-3 py-1 bg-white text-[#2D6CDF] rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">{entry.subjectName}</span>
                              {isAdmin && (
                                <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                  <button onClick={() => handleEditClick(entry)} className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors text-[#2D6CDF]" title="Edit"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDelete(entry.id)} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              )}
                            </div>
                            <h4 className="text-gray-900 font-black mb-4">{entry.subjectName}</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider"><User className="w-3 h-3" />{entry.teacherName}</div>
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3" />{entry.startTime} - {entry.endTime}</div>
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider"><MapPin className="w-3 h-3" />{entry.room}</div>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => isAdmin && openCreateModal(day, time)}
                            disabled={!isAdmin}
                            className="h-32 w-full rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center transition-colors hover:border-blue-200 hover:bg-blue-50/30 disabled:cursor-default disabled:hover:border-gray-100 disabled:hover:bg-transparent"
                            title={isAdmin ? 'Add timetable entry' : undefined}
                          >
                            <Plus className="w-6 h-6 text-gray-200 transition-colors group-hover:text-blue-200" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'add' ? 'New Schedule Entry' : 'Edit Schedule Entry'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-sm mb-2 text-gray-700">Class</label>
              <input
                type="text"
                value={selectedClass}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-bold disabled:cursor-not-allowed disabled:opacity-75"
              />
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-gray-700">Subject Name <span className="text-red-500">*</span></label>
              <select
                value={formData.subjectName}
                onChange={(event) => handleSubjectChange(event.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all appearance-none"
              >
                <option value="">Select Subject Name</option>
                {subjectOptions.map((subject) => (
                  <option key={subject.value} value={subject.value}>{subject.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-gray-700">Teacher Name <span className="text-red-500">*</span></label>
              <select
                value={formData.teacherName}
                onChange={(event) => setFormData((current) => ({ ...current, teacherName: event.target.value }))}
                disabled={Boolean(mappedTeacherName)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all appearance-none disabled:cursor-not-allowed disabled:opacity-75"
              >
                <option value="">{mappedTeacherName ? mappedTeacherName : 'Select Teacher Name'}</option>
                {teacherSelectOptions.map((teacher) => (
                  <option key={teacher.value} value={teacher.value}>{teacher.label}</option>
                ))}
              </select>
              
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-gray-700">Day of Week <span className="text-red-500">*</span></label>
              <select
                value={formData.dayOfWeek}
                onChange={(event) => setFormData((current) => ({ ...current, dayOfWeek: event.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all appearance-none"
              >
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-gray-700">Room / Lab <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.room}
                onChange={(event) => setFormData((current) => ({ ...current, room: event.target.value }))}
                disabled={Boolean(mappedRoom)}
                placeholder="e.g. Science Lab 02"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-gray-700">Start Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(event) => setFormData((current) => ({ ...current, startTime: event.target.value }))}
                list="timetable-time-options"
                step={300}
                className={INPUT_STYLES.default}
              />
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-gray-700">End Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(event) => setFormData((current) => ({ ...current, endTime: event.target.value }))}
                list="timetable-time-options"
                step={300}
                className={INPUT_STYLES.default}
              />
            </div>
          </div>

          <datalist id="timetable-time-options">
            {suggestedTimes.map((time) => (
              <option key={time} value={time} />
            ))}
          </datalist>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={`${BUTTON_STYLES.secondary} active:scale-95 shadow-lg shadow-[#2D6CDF]/20`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTimetableMutation.isPending || updateTimetableMutation.isPending}
              className={`${BUTTON_STYLES.primary} active:scale-95 shadow-lg shadow-[#2D6CDF]/20`}
            >
              {createTimetableMutation.isPending || updateTimetableMutation.isPending
                ? 'Saving...'
                : modalMode === 'add' ? 'Create Entry' : 'Update Entry'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} />
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
