import { ArrowLeft, Award, TrendingUp, Download } from 'lucide-react';

interface ExamResultsProps {
  onNavigate: (screen: string) => void;
}

export default function ExamResults({ onNavigate }: ExamResultsProps) {
  const results = [
    { subject: 'Mathematics', marks: 92, maxMarks: 100, grade: 'A+' },
    { subject: 'Science', marks: 88, maxMarks: 100, grade: 'A' },
    { subject: 'English', marks: 85, maxMarks: 100, grade: 'A' },
    { subject: 'History', marks: 90, maxMarks: 100, grade: 'A+' },
    { subject: 'Geography', marks: 87, maxMarks: 100, grade: 'A' },
    { subject: 'Computer Science', marks: 95, maxMarks: 100, grade: 'A+' },
    { subject: 'Physical Education', marks: 82, maxMarks: 100, grade: 'A' },
  ];

  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
  const maxTotalMarks = results.reduce((sum, r) => sum + r.maxMarks, 0);
  const percentage = ((totalMarks / maxTotalMarks) * 100).toFixed(2);

  const getGradeColor = (grade: string) => {
    if (grade === 'A+') return 'bg-green-100 text-green-700';
    if (grade === 'A') return 'bg-blue-100 text-blue-700';
    if (grade === 'B+') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
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
          <div className="flex-1">
            <h1 className="text-gray-900">Exam Results</h1>
            <p className="text-sm text-gray-600">Mid-Term Examination 2025</p>
          </div>
          <button className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg shadow-md hover:bg-[#1a4ba8] transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* Student Info Banner */}
        <div className="bg-gradient-to-r from-[#2D6CDF] to-[#1a4ba8] text-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-white mb-1">Sarah Johnson</h2>
              <p className="text-blue-100">Grade 10-A • Roll Number: 1024</p>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <div>
                <p className="text-sm text-blue-100">Overall Grade</p>
                <p className="text-white">A+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-gray-900 mb-6">Performance Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600 mb-2">Total Marks</p>
              <p className="text-[#2D6CDF]">
                {totalMarks}/{maxTotalMarks}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-gray-600 mb-2">Percentage</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-green-600">{percentage}%</p>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-600 mb-2">Class Rank</p>
              <p className="text-purple-600">3/45</p>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-gray-900 mb-4">Subject-wise Results</h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-700">Subject</th>
                  <th className="px-6 py-4 text-center text-gray-700">Marks Obtained</th>
                  <th className="px-6 py-4 text-center text-gray-700">Maximum Marks</th>
                  <th className="px-6 py-4 text-center text-gray-700">Percentage</th>
                  <th className="px-6 py-4 text-center text-gray-700">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result, index) => {
                  const subjectPercentage = ((result.marks / result.maxMarks) * 100).toFixed(0);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{result.subject}</td>
                      <td className="px-6 py-4 text-center text-gray-900">{result.marks}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{result.maxMarks}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2D6CDF]"
                              style={{ width: `${subjectPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-900 text-sm">{subjectPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden px-6 pb-6 space-y-4">
            {results.map((result, index) => {
              const subjectPercentage = ((result.marks / result.maxMarks) * 100).toFixed(0);
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-gray-900">{result.subject}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Marks:</span>
                      <span className="text-gray-900">
                        {result.marks}/{result.maxMarks}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Percentage:</span>
                        <span className="text-gray-900">{subjectPercentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2D6CDF]"
                          style={{ width: `${subjectPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teacher's Remarks */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-gray-900 mb-4">Teacher's Remarks</h2>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-gray-700">
              Excellent performance! Sarah has shown consistent improvement throughout the term. 
              Her dedication to studies and active participation in class discussions is commendable. 
              Keep up the great work!
            </p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">- Prof. Michael Anderson, Class Teacher</p>
              <p className="text-sm text-gray-500">November 25, 2025</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
