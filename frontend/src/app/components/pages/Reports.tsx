import { useState } from 'react';
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react';

export default function Reports() {
  const [selectedReportType, setSelectedReportType] = useState('Student Report');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const reportCategories = [
    { title: 'Student Reports', icon: FileText, count: 8, color: 'bg-blue-500' },
    { title: 'Academic Reports', icon: BarChart3, count: 12, color: 'bg-green-500' },
    { title: 'Attendance Reports', icon: TrendingUp, count: 6, color: 'bg-orange-500' },
    { title: 'Financial Reports', icon: FileText, count: 10, color: 'bg-purple-500' },
  ];

  const recentReports = [
    { name: 'Student Performance Analysis', category: 'Academic', date: '2025-11-25', type: 'PDF' },
    { name: 'Monthly Attendance Report', category: 'Attendance', date: '2025-11-24', type: 'Excel' },
    { name: 'Fee Collection Summary', category: 'Financial', date: '2025-11-23', type: 'PDF' },
    { name: 'Class-wise Results', category: 'Academic', date: '2025-11-20', type: 'Excel' },
  ];

  const handleGenerateReport = () => {
    if (!fromDate || !toDate) {
      alert('Please select both from and to dates');
      return;
    }

    const reportData = {
      type: selectedReportType,
      fromDate,
      toDate,
      generatedAt: new Date().toISOString(),
    };

    alert(`Report Generated!\n\nType: ${reportData.type}\nPeriod: ${fromDate} to ${toDate}\n\nDownloading...`);

    // Simulate download
    console.log('Generated Report:', reportData);
  };

  const handleDownloadReport = (reportName: string) => {
    alert(`Downloading: ${reportName}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate and view various reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        {reportCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-1">{category.title}</h3>
              <p className="text-gray-600">{category.count} available</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">Generate Custom Report</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Report Type</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              >
                <option>Student Report</option>
                <option>Academic Report</option>
                <option>Attendance Report</option>
                <option>Financial Report</option>
                <option>Class Performance Report</option>
                <option>Teacher Performance Report</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                />
              </div>
            </div>
            <button
              onClick={handleGenerateReport}
              className="w-full px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700 mb-1">Total Students</p>
              <p className="text-gray-900">1,248</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-gray-700 mb-1">Average Attendance</p>
              <p className="text-gray-900">94.2%</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-700 mb-1">Pass Rate</p>
              <p className="text-gray-900">98.5%</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-gray-700 mb-1">Fee Collection Rate</p>
              <p className="text-gray-900">87.8%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-gray-900">Recent Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Report Name</th>
                <th className="px-6 py-4 text-left text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-gray-700">Generated On</th>
                <th className="px-6 py-4 text-left text-gray-700">Type</th>
                <th className="px-6 py-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentReports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{report.name}</td>
                  <td className="px-6 py-4 text-gray-600">{report.category}</td>
                  <td className="px-6 py-4 text-gray-600">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">{report.type}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDownloadReport(report.name)}
                      className="px-3 py-1 text-[#2D6CDF] hover:bg-blue-50 rounded text-sm flex items-center gap-1 mx-auto"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
