import { useState } from 'react';
import { Calendar, MapPin, Eye } from 'lucide-react';
import { useToast, useConfirm } from '@/hooks/useToast';
import GridList from '@/components/GridList';
import Modal from '@/components/Modal';
import GenericForm, { type FormField } from '@/components/GenericForm';
import { ToastContainer } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { EventItem } from '../model/event.types';
import { useCreateEventMutation, useDeleteEventMutation, useEvents, useUpdateEventMutation } from '../hooks/useEvents';

const eventFormFields: FormField[] = [
  { name: 'title', label: 'Event Title', type: 'text', placeholder: 'e.g. Annual Sports Meet 2026', required: true, colSpan: 2 },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Provide details about the event...', colSpan: 2 },
  { name: 'startDate', label: 'Start Date & Time', type: 'datetime-local', required: true },
  { name: 'endDate', label: 'End Date & Time', type: 'datetime-local' },
  { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Main Auditorium', required: true },
  { name: 'type', label: 'Type', type: 'select', options: [
    { label: 'General', value: 'General' },
    { label: 'Academic', value: 'Academic' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Meeting', value: 'Meeting' },
    { label: 'Holiday', value: 'Holiday' },
    { label: 'Exam', value: 'Exam' },
  ] },
];

export default function EventsView() {
  const { data = [], isLoading } = useEvents();
  const createEventMutation = useCreateEventMutation();
  const updateEventMutation = useUpdateEventMutation();
  const deleteEventMutation = useDeleteEventMutation();
  const { toasts, remove, success, error } = useToast();
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      if (modalMode === 'add') {
        await createEventMutation.mutateAsync(data);
      } else {
        await updateEventMutation.mutateAsync({ id: selectedEvent?.id ?? 0, payload: data });
      }
      setShowModal(false);
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm('This event will be permanently removed from the calendar.', 'Delete Event?');
    if (!ok) return;
    try {
      await deleteEventMutation.mutateAsync(id);
      success('Event deleted successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const filteredEvents = data.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Upcoming', value: data.length },
    { label: 'This Month', value: data.filter((event) => new Date(event.startDate).getMonth() === new Date().getMonth()).length },
    { label: 'Venues', value: new Set(data.map((event) => event.location)).size },
  ];

  const renderEventCard = (event: EventItem) => (
    <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${event.type === 'Holiday' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
            {event.type}
          </span>
          <div className="flex gap-2">
            <button onClick={() => { setSelectedEvent(event); setShowViewModal(true); }} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h3 className="text-gray-900 font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Calendar className="w-4 h-4" />
            {new Date(event.startDate).toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <MapPin className="w-4 h-4" />
            {event.location}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <GridList
        title="Event Calendar"
        description="Schedule and manage school events and activities"
        stats={stats}
        data={filteredEvents}
        renderCard={renderEventCard}
        onAdd={() => { setModalMode('add'); setSelectedEvent(null); setShowModal(true); }}
        addLabel="Create Event"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isLoading={isLoading}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'add' ? 'Create New Event' : 'Edit Event'}>
        <GenericForm fields={eventFormFields} initialData={selectedEvent || { type: 'General' }} onSubmit={handleSubmit} onCancel={() => setShowModal(false)} submitLabel={modalMode === 'add' ? 'Create Event' : 'Update Event'} />
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Event Details">
        {selectedEvent && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">{selectedEvent.title}</h3>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{selectedEvent.type}</span>
            </div>
            <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
            <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Time</p>
                <p className="font-bold text-gray-900">{new Date(selectedEvent.startDate).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Time</p>
                <p className="font-bold text-gray-900">{selectedEvent.endDate ? new Date(selectedEvent.endDate).toLocaleString() : 'N/A'}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  {selectedEvent.location}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button onClick={() => handleDelete(selectedEvent.id)} className="px-6 py-2.5 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all">Delete</button>
              <button onClick={() => { setShowViewModal(false); setModalMode('edit'); setShowModal(true); }} className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">Edit Event</button>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmDialog isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} confirmLabel={confirmState.confirmLabel} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}
