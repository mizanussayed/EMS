import { useState, useEffect, useCallback } from 'react';
import { DollarSign, User } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import GenericTable, { Column } from '../ui/GenericTable';
import Modal from '../ui/Modal';
import { RoleGuard } from '../auth/RoleGuard';

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

export default function Fees() {
  const api = useApi();
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const fetchFees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/fees');
      setRecords(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const handleProcessPayment = async () => {
    if (!selectedRecord) return;
    try {
      await api.put(`/fees/${selectedRecord.id}/pay`, {
        amount: parseFloat(paymentAmount),
        method: paymentMethod
      });
      await fetchFees();
      setShowPaymentModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns: Column<FeeRecord>[] = [
    { 
      header: 'Student', 
      accessor: (r) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-gray-900">{r.studentName}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{r.className}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Month', 
      accessor: (r) => (
        <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-widest border border-gray-100">
          {r.month}
        </span>
      )
    },
    { header: 'Total Amount', accessor: (r) => <span className="font-bold">${r.amount.toLocaleString()}</span> },
    { header: 'Paid', accessor: (r) => <span className="font-bold text-green-600">${r.paidAmount.toLocaleString()}</span> },
    { 
      header: 'Status', 
      accessor: (r) => (
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
          r.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
          r.status === 'Partially Paid' ? 'bg-orange-50 text-orange-700 border-orange-100' :
          'bg-red-50 text-red-700 border-red-100'
        }`}>
          {r.status}
        </span>
      )
    }
  ];

  const totalCollected = records.reduce((acc, r) => acc + r.paidAmount, 0);
  const totalDue = records.reduce((acc, r) => acc + (r.amount - r.paidAmount), 0);
  const collectionRate = records.length ? ((totalCollected / records.reduce((acc, r) => acc + r.amount, 0)) * 100).toFixed(1) : '0.0';

  const stats = [
    { label: 'Total Collected', value: `$${totalCollected.toLocaleString()}`, color: 'text-green-600' },
    { label: 'Outstanding', value: `$${totalDue.toLocaleString()}`, color: 'text-red-600' },
    { label: 'Efficiency', value: `${collectionRate}%`, color: 'text-blue-600' },
  ];

  const filteredRecords = records.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="p-6">
      <GenericTable
        title="Fee Management"
        description="Financial Records & Collection"
        stats={stats}
        data={filteredRecords}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onView={(r) => {
          setSelectedRecord(r);
          setPaymentAmount(String(r.amount - r.paidAmount));
          setShowPaymentModal(true);
        }}
        addLabel="Download Report"
        isLoading={loading && records.length === 0}
      />

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Process Payment"
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Student</p>
              <p className="text-gray-900 font-black text-lg">{selectedRecord.studentName}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Month</p>
                  <p className="text-gray-700 font-bold">{selectedRecord.month}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Remaining Due</p>
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
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Payment Method</label>
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

            <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
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
        )}
      </Modal>
      </div>
    </RoleGuard>
  );
}
