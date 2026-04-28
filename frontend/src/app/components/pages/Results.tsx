import { useState, useEffect, useCallback } from 'react';
import { Search, Download, TrendingUp, Edit, X, FileText, User, ChevronRight, Award } from 'lucide-react';

interface Result {
  id: number;
  studentId: number;
  studentName: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks?: string;
}

interface Exam {
  id: number;
  title: string;
  type: string;
}

interface ResultsProps {
  token: string;
}

export default function Results({ token }: ResultsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchExams = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/exams`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch exams');
      const data = await response.json();
      setExams(data);
      if (data.length > 0) setSelectedExamId(data[0].id);
    } catch (err: any) {
      setError(err.message);
    }
  }, [apiUrl, token]);

  const fetchResults = useCallback(async () => {
    if (!selectedExamId) return;
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/exams/${selectedExamId}/results`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch results');
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token, selectedExamId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const filteredResults = results.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    avg: results.length ? (results.reduce((acc, r) => acc + (r.marksObtained / r.totalMarks), 0) / results.length * 100).toFixed(1) : '0.0',
    total: results.length,
    topGrade: results.filter(r => r.grade === 'A+' || r.grade === 'A').length,
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-bold text-3xl mb-2">Academic Performance</h1>
          <p className="text-gray-500 font-medium">Detailed breakdown of examination results</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(Number(e.target.value))}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all font-bold text-gray-700 shadow-sm"
          >
            {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
            {exams.length === 0 && <option value="">No Exams Found</option>}
          </select>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold shadow-lg shadow-black/10 active:scale-95">
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
          <X className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#2D6CDF] to-[#1a4ba8] rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
          <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-2">Class Average</p>
          <p className="text-5xl font-black">{stats.avg}%</p>
          <div className="mt-4 flex items-center gap-2 text-blue-100 text-sm font-bold">
            <TrendingUp className="w-4 h-4" />
            +2.4% from last term
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Total Records</p>
          <p className="text-gray-900 text-4xl font-black">{stats.total}</p>
          <p className="mt-4 text-gray-500 text-sm font-bold">Processed for this exam</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Top Grades (A/A+)</p>
          <p className="text-green-600 text-4xl font-black">{stats.topGrade}</p>
          <p className="mt-4 text-gray-500 text-sm font-bold">Students excelled</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student or subject..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Subject</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest text-center">Score</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest text-center">Grade</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold group-hover:text-[#2D6CDF] transition-colors">{result.studentName}</p>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">ID: {result.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 font-bold">{result.subjectName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex flex-col">
                      <span className="text-gray-900 font-black text-lg">{result.marksObtained}</span>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">/ {result.totalMarks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${
                        result.grade === 'A+' || result.grade === 'A' ? 'bg-green-50 text-green-600' :
                        result.grade === 'B+' || result.grade === 'B' ? 'bg-blue-50 text-blue-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {result.grade}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-gray-500 text-sm italic">"{result.remarks || 'No remarks provided'}"</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#2D6CDF] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold">Loading results...</p>
          </div>
        )}

        {!loading && filteredResults.length === 0 && (
          <div className="py-20 text-center">
            <Award className="w-16 h-16 text-gray-100 mx-auto mb-4" />
            <h3 className="text-gray-900 font-bold text-xl mb-1">No Results Uploaded</h3>
            <p className="text-gray-500">Results for this exam are currently being processed or not yet available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
