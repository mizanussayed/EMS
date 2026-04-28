import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Download, CheckCircle, Clock, X, Search, User, CreditCard, TrendingUp, AlertCircle, Receipt } from 'lucide-react';

interface FeeRecord {
  id: number;
  studentId: number;
  studentName: string;
  className: string;
  month: string;
  amount: number;
  paidAmount: number;
  status: string;
  paymentDate?: string;
  paymentMethod?: string;
}

interface FeesProps {
  token: string;
}

export default function Fees({ token }: FeesProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchFees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/fees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch fee records');
      const data = await response.json();
      setRecords(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const handleProcessPayment = async () => {
    if (!selectedRecord) return;
    try {
      const response = await fetch(`${apiUrl}/fees/${selectedRecord.id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          method: paymentMethod
        })
      });
      if (!response.ok) throw new Error('Payment processing failed');
      await fetchFees();
      setShowPaymentModal(false);
      setSelectedRecord(null);
      setPaymentAmount('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredRecords = records.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalCollected: records.reduce((acc, r) => acc + r.paidAmount, 0),
    totalDue: records.reduce((acc, r) => acc + (r.amount - r.paidAmount), 0),
    collectionRate: records.length ? ((records.reduce((acc, r) => acc + r.paidAmount, 0) / records.reduce((acc, r) => acc + r.amount, 0)) * 100).toFixed(1) : '0.0'
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-black text-3xl mb-2">Fee Management</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Financial Records & Collection</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-black shadow-xl shadow-black/10 active:scale-95">
          <Download className="w-5 h-5" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-[2rem] p-8 text-white shadow-xl shadow-green-500/20 relative overflow-hidden">
          <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
          <p className="text-green-100 text-[10px] font-black uppercase tracking-widest mb-1">Total Collected</p>
          <p className="text-4xl font-black">${stats.totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-[2rem] p-8 text-white shadow-xl shadow-red-500/20 relative overflow-hidden">
          <AlertCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
          <p className="text-red-100 text-[10px] font-black uppercase tracking-widest mb-1">Outstanding Balance</p>
          <p className="text-4xl font-black">${stats.totalDue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Collection Efficiency</p>
          <p className="text-gray-900 text-4xl font-black">{stats.collectionRate}%</p>
          <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#2D6CDF] h-full" style={{ width: `${stats.collectionRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or class..." 
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest">Student</th>
                <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest">Month</th>
                <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Total Amount</th>
                <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Paid</th>
                <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-black group-hover:text-[#2D6CDF] transition-colors">{record.studentName}</p>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{record.className}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {record.month}
                    </span>
                  </td>
                  <td className="p-6 text-right font-black text-gray-900">${record.amount.toLocaleString()}</td>
                  <td className="p-6 text-right font-black text-green-600">${record.paidAmount.toLocaleString()}</td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                      record.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
                      record.status === 'Partially Paid' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => {
                        setSelectedRecord(record);
                        setPaymentAmount(String(record.amount - record.paidAmount));
                        setShowPaymentModal(true);
                      }}
                      disabled={record.status === 'Paid'}
                      className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all active:scale-95 ${
                        record.status === 'Paid' 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#2D6CDF] text-white hover:bg-[#1a4ba8] shadow-lg shadow-[#2D6CDF]/20'
                      }`}
                    >
                      Collect Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2D6CDF] rounded-xl flex items-center justify-center text-white">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-gray-900 font-black text-xl">Process Payment</h2>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Student</p>
                <p className="text-gray-900 font-black text-lg">{selectedRecord.studentName}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Month</p>
                    <p className="text-gray-700 font-bold">{selectedRecord.month}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Remaining</p>
                    <p className="text-red-500 font-black">${(selectedRecord.amount - selectedRecord.paidAmount).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Payment Amount ($)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black text-2xl text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Cash', 'Card', 'Online'].map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`py-3 rounded-xl font-black text-xs transition-all border ${
                        paymentMethod === m 
                          ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-black/10'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 flex flex-col gap-3 bg-gray-50/50">
              <button
                onClick={handleProcessPayment}
                className="w-full py-4 bg-[#2D6CDF] text-white rounded-2xl font-black hover:bg-[#1a4ba8] transition-all shadow-xl shadow-[#2D6CDF]/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Confirm Payment
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-4 text-gray-500 font-black text-xs uppercase tracking-widest hover:text-gray-700 transition-colors"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
