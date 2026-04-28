import { useState, useEffect, useCallback } from 'react';
import { Plus, Calendar, MapPin, Users, Edit, Trash2, X, Eye, Bell, Info, Filter, Search } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
}

interface EventsProps {
  token: string;
}

export default function Events({ token }: EventsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    type: 'General'
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = async () => {
    try {
      const response = await fetch(`${apiUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to create event');
      await fetchEvents();
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await fetch(`${apiUrl}/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete event');
      await fetchEvents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-black text-3xl mb-2">Events & Activities</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">School Calendar Management</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-[#2D6CDF] text-white rounded-2xl hover:bg-[#1a4ba8] flex items-center justify-center gap-2 font-black shadow-xl shadow-[#2D6CDF]/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Schedule New Event
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..." 
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
            />
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all group relative">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    event.type === 'Exam' ? 'bg-red-50 text-red-600 border border-red-100' :
                    event.type === 'Holiday' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                    'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {event.type}
                  </div>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 hover:bg-red-50 rounded-xl text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-gray-900 font-black text-xl mb-4">{event.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-bold">{event.description}</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Calendar className="w-5 h-5 text-[#2D6CDF]" />
                    <span className="text-xs font-black uppercase tracking-wider text-gray-700">
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <MapPin className="w-5 h-5 text-[#2D6CDF]" />
                    <span className="text-xs font-black uppercase tracking-wider text-gray-700">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-black">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-[#2D6CDF] border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                      +45
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-[#2D6CDF] font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                    Details <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <Info className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest">No events found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-gray-900 font-black text-2xl">Create Event</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10 overflow-y-auto space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Annual Sports Meet 2026"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Provide details about the event..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Start Date *</label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">End Date</label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Main Auditorium"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black"
                    >
                      <option>General</option>
                      <option>Academic</option>
                      <option>Sports</option>
                      <option>Meeting</option>
                      <option>Holiday</option>
                      <option>Exam</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-8 py-3 text-gray-500 font-bold hover:bg-white rounded-2xl transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleAddEvent}
                className="px-10 py-3 bg-[#2D6CDF] text-white rounded-2xl font-black hover:bg-[#1a4ba8] transition-all shadow-xl shadow-[#2D6CDF]/20 active:scale-95"
              >
                Schedule Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
