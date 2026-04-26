import { useState } from 'react';
import { Clock, Edit, X } from 'lucide-react';

type ScheduleType = {
  [key: string]: string[];
};

export default function Timetable() {
  const [selectedClass, setSelectedClass] = useState('Grade 10A');
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCell, setEditingCell] = useState<{ day: string; timeIndex: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const [schedule, setSchedule] = useState<ScheduleType>({
    Monday: ['Mathematics', 'Physics', 'English', 'Chemistry', 'Break', 'Biology', 'PE'],
    Tuesday: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Break', 'Computer', 'Art'],
    Wednesday: ['English', 'Mathematics', 'Biology', 'Physics', 'Break', 'Chemistry', 'Music'],
    Thursday: ['Chemistry', 'Biology', 'English', 'Mathematics', 'Break', 'Physics', 'Library'],
    Friday: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Break', 'Biology', 'Sports'],
  });

  const handleEditClick = (day: string, timeIndex: number) => {
    setEditingCell({ day, timeIndex });
    setEditValue(schedule[day][timeIndex]);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingCell) {
      setSchedule({
        ...schedule,
        [editingCell.day]: schedule[editingCell.day].map((subject, idx) =>
          idx === editingCell.timeIndex ? editValue : subject
        ),
      });
      setShowEditModal(false);
      setEditingCell(null);
      setEditValue('');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Class Timetable</h1>
        <p className="text-gray-600">View and manage class schedules</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
          >
            <option>Grade 10A</option>
            <option>Grade 10B</option>
            <option>Grade 9A</option>
            <option>Grade 9B</option>
          </select>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
          >
            <option>This Week</option>
            <option>Next Week</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 text-left text-gray-700 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </div>
                </th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-4 text-center text-gray-700 min-w-[150px]">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timeSlots.map((time, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-900">{time}</td>
                  {days.map((day) => {
                    const subject = schedule[day as keyof typeof schedule][index];
                    const isBreak = subject === 'Break';
                    return (
                      <td key={day} className="px-4 py-4">
                        <div
                          className={`p-3 rounded-lg text-center relative group cursor-pointer ${
                            isBreak ? 'bg-gray-100 text-gray-700' :
                            subject === 'Mathematics' ? 'bg-blue-100 text-blue-700' :
                            subject === 'Physics' ? 'bg-purple-100 text-purple-700' :
                            subject === 'Chemistry' ? 'bg-green-100 text-green-700' :
                            subject === 'English' ? 'bg-orange-100 text-orange-700' :
                            subject === 'Biology' ? 'bg-pink-100 text-pink-700' :
                            'bg-indigo-100 text-indigo-700'
                          }`}
                          onClick={() => handleEditClick(day, index)}
                        >
                          <p className="text-sm">{subject}</p>
                          <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Edit Timetable Slot</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Day: <span className="text-gray-900">{editingCell.day}</span></p>
                <p className="text-sm text-gray-600">Time: <span className="text-gray-900">{timeSlots[editingCell.timeIndex]}</span></p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Subject / Activity</label>
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                >
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>English</option>
                  <option>Biology</option>
                  <option>Computer</option>
                  <option>Art</option>
                  <option>Music</option>
                  <option>PE</option>
                  <option>Sports</option>
                  <option>Library</option>
                  <option>Break</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
