import { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Edit, Trash2, X, Eye } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  participants: number;
  status: string;
  description?: string;
}

export default function Events() {
  const [filterType, setFilterType] = useState('All Types');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [events, setEvents] = useState<Event[]>([
    { id: 'EVT001', title: 'Parent-Teacher Meeting', date: '2025-12-01', time: '10:00 AM', location: 'Main Auditorium', type: 'Meeting', participants: 150, status: 'Upcoming', description: 'Quarterly parent-teacher meeting to discuss student progress' },
    { id: 'EVT002', title: 'Annual Sports Day', date: '2025-12-15', time: '08:00 AM', location: 'Sports Ground', type: 'Sports', participants: 800, status: 'Upcoming', description: 'Annual inter-class sports competition' },
    { id: 'EVT003', title: 'Science Exhibition', date: '2025-12-10', time: '09:00 AM', location: 'Science Lab', type: 'Academic', participants: 200, status: 'Upcoming', description: 'Student science projects exhibition' },
    { id: 'EVT004', title: 'Cultural Fest', date: '2025-11-20', time: '05:00 PM', location: 'Main Auditorium', type: 'Cultural', participants: 500, status: 'Completed', description: 'Annual cultural festival with performances' },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Academic',
    participants: '0',
    description: '',
  });

  const filteredEvents = events.filter(event =>
    filterType === 'All Types' || event.type === filterType
  );

  const handleAddEvent = () => {
    const newEvent: Event = {
      id: `EVT${String(events.length + 1).padStart(3, '0')}`,
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      type: formData.type,
      participants: parseInt(formData.participants),
      status: 'Upcoming',
      description: formData.description,
    };
    setEvents([...events, newEvent]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(e =>
        e.id === selectedEvent.id
          ? { ...e, ...formData, participants: parseInt(formData.participants) }
          : e
      ));
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      participants: String(event.participants),
      description: event.description || '',
    });
    setShowEditModal(true);
  };

  const handleViewClick = (event: Event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'Academic',
      participants: '0',
      description: '',
    });
  };

  const upcomingEvents = events.filter(e => e.status === 'Upcoming').length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;
  const totalParticipants = events.reduce((acc, e) => acc + e.participants, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Events & Activities</h1>
        <p className="text-gray-600">Manage school events and activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Events</p>
          <p className="text-gray-900 mt-1">{events.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Upcoming</p>
          <p className="text-blue-600 mt-1">{upcomingEvents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-green-600 mt-1">{completedEvents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Participants</p>
          <p className="text-purple-600 mt-1">{totalParticipants}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              <option>All Types</option>
              <option>Academic</option>
              <option>Sports</option>
              <option>Cultural</option>
              <option>Meeting</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Schedule Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewClick(event)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleEditClick(event)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-sm mb-4 inline-block ${
              event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
              {event.status}
            </span>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{event.date} at {event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{event.participants} participants</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <span className={`px-3 py-1 rounded-full text-sm ${
                event.type === 'Academic' ? 'bg-purple-100 text-purple-700' :
                event.type === 'Sports' ? 'bg-orange-100 text-orange-700' :
                event.type === 'Cultural' ? 'bg-pink-100 text-pink-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {event.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-white rounded-xl">
          No events found matching your criteria
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Schedule New Event</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Time *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    placeholder="e.g., 10:00 AM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Event Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option>Academic</option>
                    <option>Sports</option>
                    <option>Cultural</option>
                    <option>Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Expected Participants</label>
                  <input
                    type="number"
                    value={formData.participants}
                    onChange={(e) => setFormData({...formData, participants: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                onClick={handleAddEvent}
                disabled={!formData.title || !formData.date || !formData.location}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Edit Event - {selectedEvent.title}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Time *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
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
                onClick={handleEditEvent}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {showViewModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Event Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Event ID</label>
                  <p className="text-gray-900">{selectedEvent.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    selectedEvent.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {selectedEvent.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Event Title</label>
                  <p className="text-gray-900">{selectedEvent.title}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date</label>
                  <p className="text-gray-900">{selectedEvent.date}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Time</label>
                  <p className="text-gray-900">{selectedEvent.time}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Location</label>
                  <p className="text-gray-900">{selectedEvent.location}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Type</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    selectedEvent.type === 'Academic' ? 'bg-purple-100 text-purple-700' :
                    selectedEvent.type === 'Sports' ? 'bg-orange-100 text-orange-700' :
                    selectedEvent.type === 'Cultural' ? 'bg-pink-100 text-pink-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedEvent.type}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Expected Participants</label>
                  <p className="text-gray-900">{selectedEvent.participants}</p>
                </div>
                {selectedEvent.description && (
                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">Description</label>
                    <p className="text-gray-900">{selectedEvent.description}</p>
                  </div>
                )}
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
                  handleEditClick(selectedEvent);
                }}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Edit Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
