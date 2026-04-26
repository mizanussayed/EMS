import { useState } from 'react';
import { School, User, Bell, Lock, Globe, Palette } from 'lucide-react';

export default function Settings() {
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'ABC International School',
    code: 'ABC-2025',
    email: 'info@abcschool.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Education Street, Knowledge City',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    attendanceAlerts: true,
    feeReminders: true,
    examNotifications: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'English',
  });

  const settingsCategories = [
    { icon: School, title: 'School Information', description: 'Manage school details and branding', color: 'bg-blue-500', id: 'school' },
    { icon: User, title: 'Profile Settings', description: 'Update your personal information', color: 'bg-purple-500', id: 'profile' },
    { icon: Bell, title: 'Notifications', description: 'Configure notification preferences', color: 'bg-orange-500', id: 'notifications' },
    { icon: Lock, title: 'Security', description: 'Manage password and security settings', color: 'bg-red-500', id: 'security' },
    { icon: Globe, title: 'Localization', description: 'Set language and regional preferences', color: 'bg-green-500', id: 'localization' },
    { icon: Palette, title: 'Appearance', description: 'Customize theme and display', color: 'bg-pink-500', id: 'appearance' },
  ];

  const handleSaveSchoolInfo = () => {
    alert('School information saved successfully!');
  };

  const handleSaveNotifications = () => {
    alert('Notification preferences saved successfully!');
  };

  const handleSaveAppearance = () => {
    alert('Appearance settings saved successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your system preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {settingsCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">School Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">School Name</label>
              <input
                type="text"
                value={schoolInfo.name}
                onChange={(e) => setSchoolInfo({...schoolInfo, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">School Code</label>
              <input
                type="text"
                value={schoolInfo.code}
                onChange={(e) => setSchoolInfo({...schoolInfo, code: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={schoolInfo.email}
                onChange={(e) => setSchoolInfo({...schoolInfo, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={schoolInfo.phone}
                onChange={(e) => setSchoolInfo({...schoolInfo, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Address</label>
              <textarea
                rows={2}
                value={schoolInfo.address}
                onChange={(e) => setSchoolInfo({...schoolInfo, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              ></textarea>
            </div>
            <button
              onClick={handleSaveSchoolInfo}
              className="w-full px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">System Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="text-gray-900">v2.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900">Nov 26, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Students Enrolled</span>
              <span className="text-gray-900">1,248</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Teachers</span>
              <span className="text-gray-900">87</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Academic Year</span>
              <span className="text-gray-900">2025-2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Classes</span>
              <span className="text-gray-900">42</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D6CDF]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.smsNotifications}
                  onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D6CDF]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D6CDF]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Attendance Alerts</p>
                <p className="text-sm text-gray-500">Get alerts for low attendance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.attendanceAlerts}
                  onChange={(e) => setNotifications({...notifications, attendanceAlerts: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D6CDF]"></div>
              </label>
            </div>
            <button
              onClick={handleSaveNotifications}
              className="w-full px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
            >
              Save Preferences
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">Appearance Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Theme</label>
              <select
                value={appearance.theme}
                onChange={(e) => setAppearance({...appearance, theme: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Language</label>
              <select
                value={appearance.language}
                onChange={(e) => setAppearance({...appearance, language: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Chinese</option>
              </select>
            </div>
            <button
              onClick={handleSaveAppearance}
              className="w-full px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
            >
              Save Appearance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
