import { useState, useEffect, useCallback } from 'react';
import { FileText, User, TrendingUp, Download } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import GenericTable, { type Column } from '@/components/GenericTable';

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

export default function ResultsView() {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Result[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExams = useCallback(async () => {
    try {
      const data = await api.get('/exams');
      setExams(data);
      if (data.length > 0) setSelectedExamId(data[0].id);
    } catch (err: any) {
      console.error(err.message);
    }
  }, [api]);

  const fetchResults = useCallback(async () => {
    if (!selectedExamId) return;
    try {
      setLoading(true);
      const data = await api.get(`/exams/${selectedExamId}/results`);
      setResults(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, selectedExamId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const columns: Column<Result>[] = [
    { header: 'Student', accessor: (result) => <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100"><User className="w-5 h-5" /></div><div><div className="font-bold text-gray-900">{result.studentName}</div><div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {result.studentId}</div></div></div> },
    { header: 'Subject', accessor: (result) => <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /><span className="text-gray-700 font-bold">{result.subjectName}</span></div> },
    { header: 'Score', accessor: (result) => <div className="inline-flex flex-col text-center"><span className="text-gray-900 font-black text-lg">{result.marksObtained}</span><span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">/ {result.totalMarks}</span></div> },
    { header: 'Grade', accessor: (result) => <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border shadow-sm mx-auto ${result.grade === 'A+' || result.grade === 'A' ? 'bg-green-50 text-green-600 border-green-100' : result.grade === 'B+' || result.grade === 'B' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{result.grade}</div> },
    { header: 'Remarks', accessor: (result) => <span className="text-gray-500 text-sm italic">"{result.remarks || '—'}"</span> },
  ];

  const classAverage = results.length ? (results.reduce((accumulator, result) => accumulator + (result.marksObtained / result.totalMarks), 0) / results.length * 100).toFixed(1) : '0.0';

  const filteredResults = results.filter((result) =>
    result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-black text-3xl mb-1">Academic Performance</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Examination Results Analysis</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedExamId} onChange={(e) => setSelectedExamId(Number(e.target.value))} className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 transition-all font-bold text-gray-700 shadow-sm">
            {exams.map((exam) => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
            {exams.length === 0 && <option value="">No Exams Found</option>}
          </select>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-black shadow-xl active:scale-95">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#2D6CDF] to-[#1a4ba8] rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Class Average</p>
          <p className="text-4xl font-black">{classAverage}%</p>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Records</p>
          <p className="text-4xl font-black text-gray-900">{results.length}</p>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Top Grades</p>
          <p className="text-4xl font-black text-green-600">{results.filter((result) => result.grade === 'A+' || result.grade === 'A').length}</p>
        </div>
      </div>

      <GenericTable
        title="Result Breakdown"
        description="Detailed view of student scores and grades"
        data={filteredResults}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isLoading={loading && results.length === 0}
        addLabel="Refresh Results"
        onAdd={fetchResults}
      />
    </div>
  );
}
