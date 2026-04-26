import { useState } from 'react';
import { Search, Download, TrendingUp, Edit, X } from 'lucide-react';

interface Result {
  student: string;
  rollNo: string;
  class: string;
  exam: string;
  math: number;
  physics: number;
  chemistry: number;
  english: number;
  total: number;
  percentage: number;
  grade: string;
}

export default function Results() {
  const [filterClass, setFilterClass] = useState('All Classes');
  const [filterExam, setFilterExam] = useState('All Exams');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  const [results, setResults] = useState<Result[]>([
    { student: 'John Smith', rollNo: '2025001', class: 'Grade 10A', exam: 'Mid-term', math: 92, physics: 88, chemistry: 85, english: 90, total: 355, percentage: 88.75, grade: 'A+' },
    { student: 'Sarah Johnson', rollNo: '2025002', class: 'Grade 10A', exam: 'Mid-term', math: 95, physics: 92, chemistry: 90, english: 93, total: 370, percentage: 92.50, grade: 'A+' },
    { student: 'Michael Brown', rollNo: '2025003', class: 'Grade 9B', exam: 'Mid-term', math: 78, physics: 75, chemistry: 80, english: 82, total: 315, percentage: 78.75, grade: 'B+' },
    { student: 'Emily Davis', rollNo: '2025004', class: 'Grade 10B', exam: 'Mid-term', math: 88, physics: 85, chemistry: 87, english: 89, total: 349, percentage: 87.25, grade: 'A' },
  ]);

  const [formData, setFormData] = useState({
    math: '0',
    physics: '0',
    chemistry: '0',
    english: '0',
  });

  const filteredResults = results.filter(result => {
    const matchesClass = filterClass === 'All Classes' || result.class === filterClass;
    const matchesExam = filterExam === 'All Exams' || result.exam === filterExam;
    return matchesClass && matchesExam;
  });

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const handleEditClick = (result: Result) => {
    setSelectedResult(result);
    setFormData({
      math: String(result.math),
      physics: String(result.physics),
      chemistry: String(result.chemistry),
      english: String(result.english),
    });
    setShowEditModal(true);
  };

  const handleUpdateResult = () => {
    if (selectedResult) {
      const math = parseInt(formData.math);
      const physics = parseInt(formData.physics);
      const chemistry = parseInt(formData.chemistry);
      const english = parseInt(formData.english);
      const total = math + physics + chemistry + english;
      const percentage = (total / 400) * 100;
      const grade = calculateGrade(percentage);

      setResults(results.map(r =>
        r.rollNo === selectedResult.rollNo
          ? { ...r, math, physics, chemistry, english, total, percentage, grade }
          : r
      ));
      setShowEditModal(false);
      setSelectedResult(null);
    }
  };

  const handleExportResults = () => {
    alert('Exporting results to CSV...');
  };

  const avgPercentage = (results.reduce((acc, r) => acc + r.percentage, 0) / results.length).toFixed(1);
  const passRate = ((results.filter(r => r.percentage >= 40).length / results.length) * 100).toFixed(1);
  const topScorer = results.reduce((max, r) => r.percentage > max.percentage ? r : max, results[0]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Exam Results</h1>
        <p className="text-gray-600">View and manage student exam results</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Class Average</p>
          <p className="text-gray-900 mt-1">{avgPercentage}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Pass Rate</p>
          <p className="text-green-600 mt-1">{passRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Top Scorer</p>
          <p className="text-blue-600 mt-1">{topScorer?.student}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-orange-600 mt-1">{results.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              <option>All Classes</option>
              <option>Grade 10A</option>
              <option>Grade 10B</option>
              <option>Grade 9A</option>
              <option>Grade 9B</option>
            </select>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              <option>All Exams</option>
              <option>Mid-term</option>
              <option>Final</option>
              <option>Unit Test</option>
            </select>
          </div>
          <button
            onClick={handleExportResults}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Results
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Roll No</th>
                <th className="px-6 py-4 text-left text-gray-700">Student Name</th>
                <th className="px-6 py-4 text-left text-gray-700">Class</th>
                <th className="px-6 py-4 text-center text-gray-700">Math</th>
                <th className="px-6 py-4 text-center text-gray-700">Physics</th>
                <th className="px-6 py-4 text-center text-gray-700">Chemistry</th>
                <th className="px-6 py-4 text-center text-gray-700">English</th>
                <th className="px-6 py-4 text-center text-gray-700">Total</th>
                <th className="px-6 py-4 text-center text-gray-700">Percentage</th>
                <th className="px-6 py-4 text-center text-gray-700">Grade</th>
                <th className="px-6 py-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResults.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{result.rollNo}</td>
                  <td className="px-6 py-4 text-gray-900">{result.student}</td>
                  <td className="px-6 py-4 text-gray-600">{result.class}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{result.math}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{result.physics}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{result.chemistry}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{result.english}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{result.total}</td>
                  <td className="px-6 py-4 text-center text-gray-900">{result.percentage.toFixed(2)}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      result.grade === 'A+' ? 'bg-green-100 text-green-700' :
                      result.grade === 'A' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleEditClick(result)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit Marks"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No results found matching your criteria
          </div>
        )}
      </div>

      {/* Edit Result Modal */}
      {showEditModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Edit Marks - {selectedResult.student}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Roll No:</span>
                    <span className="text-gray-900 ml-2">{selectedResult.rollNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Class:</span>
                    <span className="text-gray-900 ml-2">{selectedResult.class}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Exam:</span>
                    <span className="text-gray-900 ml-2">{selectedResult.exam}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Mathematics (out of 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.math}
                    onChange={(e) => setFormData({...formData, math: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Physics (out of 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.physics}
                    onChange={(e) => setFormData({...formData, physics: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Chemistry (out of 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.chemistry}
                    onChange={(e) => setFormData({...formData, chemistry: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">English (out of 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.english}
                    onChange={(e) => setFormData({...formData, english: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Total: {parseInt(formData.math || '0') + parseInt(formData.physics || '0') + parseInt(formData.chemistry || '0') + parseInt(formData.english || '0')} / 400
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Percentage: {(((parseInt(formData.math || '0') + parseInt(formData.physics || '0') + parseInt(formData.chemistry || '0') + parseInt(formData.english || '0')) / 400) * 100).toFixed(2)}%
                </p>
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
                onClick={handleUpdateResult}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8]"
              >
                Update Marks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
