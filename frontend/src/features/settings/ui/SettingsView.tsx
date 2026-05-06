import { useState } from 'react';
import { School, User, Bell, Lock, Globe, Palette, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { HasRole } from '@/app/components/auth/RoleGuard';

export default function SettingsView() {
  const { auth } = useAuth();
  const [schoolInfo, setSchoolInfo] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    attendanceAlerts: true,
    feeReminders: true,
    examNotifications: true,
  });

  const settingsCategories = [
    { icon: School, title: 'School Information', description: 'Manage school details and branding', color: 'bg-blue-500' },
    { icon: User, title: 'Profile Settings', description: 'Update your personal information', color: 'bg-purple-500' },
    { icon: Bell, title: 'Notifications', description: 'Configure notification preferences', color: 'bg-orange-500' },
    { icon: Lock, title: 'Security', description: 'Manage password and security settings', color: 'bg-red-500' },
    { icon: Globe, title: 'Localization', description: 'Set language and regional preferences', color: 'bg-green-500' },
    { icon: Palette, title: 'Appearance', description: 'Customize theme and display', color: 'bg-pink-500' },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <h1 className="text-gray-900 font-black text-3xl mb-2">Settings</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">System configuration & preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {settingsCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 font-black text-lg mb-2">{category.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{category.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <HasRole allowedRoles={['admin']}>
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-gray-900 font-black text-xl">School Profile</h2>
              <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-[#2D6CDF] transition-colors">
                <Save className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">School Name</label>
                <input type="text" value={schoolInfo.name} onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">School Code</label>
                  <input type="text" value={schoolInfo.code} onChange={(e) => setSchoolInfo({ ...schoolInfo, code: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                  <input type="tel" value={schoolInfo.phone} onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Contact Email</label>
                <input type="email" value={schoolInfo.email} onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold" />
              </div>
              <button className="w-full py-4 bg-[#2D6CDF] text-white rounded-2xl font-black shadow-xl shadow-[#2D6CDF]/20 hover:bg-[#1a4ba8] transition-all active:scale-95">Update School Information</button>
            </div>
          </div>
        </HasRole>

        <div className="space-y-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <Lock className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
            <h2 className="text-xl font-black mb-8 relative z-10">User Account</h2>
            <div className="flex items-center gap-6 mb-8 relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 flex items-center justify-center text-3xl font-black">
                {(auth?.userName ?? 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-2xl font-black">{auth?.userName}</p>
                <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">{auth?.role}</p>
              </div>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">Username</span>
                <span className="font-bold">{auth?.userName}</span>
              </div>
              <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Change Password</button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
            <h2 className="text-gray-900 font-black text-xl mb-8">System Notifications</h2>
            <div className="space-y-6">
              {[
                { label: 'Email Notifications', key: 'emailNotifications', desc: 'Summary of daily activities' },
                { label: 'Attendance Alerts', key: 'attendanceAlerts', desc: 'Real-time student check-in alerts' },
                { label: 'Fee Reminders', key: 'feeReminders', desc: 'Automated pending due alerts' },
              ].map((notif) => (
                <div key={notif.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 font-bold">{notif.label}</p>
                    <p className="text-gray-400 text-xs font-medium">{notif.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={(notifications as any)[notif.key]} onChange={(e) => setNotifications({ ...notifications, [notif.key]: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D6CDF]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
