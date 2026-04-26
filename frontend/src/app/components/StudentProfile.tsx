import { useState } from 'react';
import { ArrowLeft, UserCircle, Mail, Phone, MapPin, FileText, Calendar } from 'lucide-react';

interface StudentProfileProps {
  onNavigate: (screen: string) => void;
}

export default function StudentProfile({ onNavigate }: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'marks', label: 'Marks' },
    { id: 'fees', label: 'Fees' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-2">Parent Name</label>
              <p className="text-gray-900">Mr. John Smith</p>
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Parent Contact</label>
              <p className="text-gray-900">+1 (555) 123-4567</p>
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Parent Email</label>
              <p className="text-gray-900">john.smith@email.com</p>
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Admission Number</label>
              <p className="text-gray-900">ADM2024001</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-600 mb-2">Address</label>
              <p className="text-gray-900">123 Main Street, Springfield, IL 62701, USA</p>
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Date of Birth</label>
              <p className="text-gray-900">January 15, 2010</p>
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Blood Group</label>
              <p className="text-gray-900">O+</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-600 mb-2">Documents</label>
              <div className="flex gap-3 flex-wrap">
                <button className="px-4 py-2 bg-blue-50 text-[#2D6CDF] rounded-lg hover:bg-blue-100">
                  Birth Certificate.pdf
                </button>
                <button className="px-4 py-2 bg-blue-50 text-[#2D6CDF] rounded-lg hover:bg-blue-100">
                  ID Card.pdf
                </button>
                <button className="px-4 py-2 bg-blue-50 text-[#2D6CDF] rounded-lg hover:bg-blue-100">
                  Medical Records.pdf
                </button>
              </div>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-900">Overall Attendance</p>
                <p className="text-gray-600">This Academic Year</p>
              </div>
              <div className="text-right">
                <p className="text-[#2D6CDF]">94.5%</p>
                <p className="text-sm text-gray-600">189/200 days</p>
              </div>
            </div>
            <div className="space-y-3">
              {['November 2025', 'October 2025', 'September 2025'].map((month, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900">{month}</p>
                    <p className="text-[#2D6CDF]">{95 - i}%</p>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2D6CDF]"
                      style={{ width: `${95 - i}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'marks':
        return (
          <div>
            <button
              onClick={() => onNavigate('exam-results')}
              className="mb-6 text-[#2D6CDF] hover:underline"
            >
              View Detailed Results →
            </button>
            <div className="space-y-3">
              {[
                { subject: 'Mathematics', marks: 92, total: 100 },
                { subject: 'Science', marks: 88, total: 100 },
                { subject: 'English', marks: 85, total: 100 },
                { subject: 'History', marks: 90, total: 100 },
                { subject: 'Geography', marks: 87, total: 100 },
              ].map((subject, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-900">{subject.subject}</p>
                    <p className="text-gray-900">
                      {subject.marks}/{subject.total}
                    </p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${subject.marks}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'fees':
        return (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">Fee Status: Paid</p>
              <p className="text-sm text-green-700 mt-1">All fees are up to date for this semester</p>
            </div>
            <div className="space-y-3">
              {[
                { term: 'Fall 2025', amount: '$2,500', status: 'Paid', date: 'Sep 1, 2025' },
                { term: 'Summer 2025', amount: '$2,500', status: 'Paid', date: 'May 1, 2025' },
                { term: 'Spring 2025', amount: '$2,500', status: 'Paid', date: 'Jan 1, 2025' },
              ].map((fee, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-gray-900">{fee.term}</p>
                    <p className="text-sm text-gray-600">{fee.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">{fee.amount}</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {fee.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate('admin')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-gray-900">Student Profile</h1>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCircle className="w-20 h-20 text-[#2D6CDF]" />
            </div>

            <div className="flex-1">
              <h2 className="text-gray-900 mb-2">Sarah Johnson</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="text-gray-900">Grade 10-A</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Roll Number</p>
                  <p className="text-gray-900">1024</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900 text-sm">sarah.j@school.edu</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900 text-sm">+1 (555) 987-6543</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="px-6 py-2 bg-[#2D6CDF] text-white rounded-lg shadow-md hover:bg-[#1a4ba8] transition-all">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'border-b-2 border-[#2D6CDF] text-[#2D6CDF]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">{renderTabContent()}</div>
        </div>
      </main>
    </div>
  );
}
