import { useState, useEffect, useCallback } from 'react';
import { DollarSign, User, Settings } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import GenericTable, { type Column } from '@/components/GenericTable';
import Modal from '@/components/Modal';
import { RoleGuard } from '@/app/guards/RoleGuard';
import FeeConfigurationView from './FeeConfigurationView';

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

export default function FeesView() {
  const api = useApi();
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [activeTab, setActiveTab] = useState<'records' | 'config'>('records');

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

  useEffect(() => { fetchFees(); }, [fetchFees]);

  const handleProcessPayment = async () => {
    if (!selectedRecord) return;
    try {
      await api.put(`/fees/${selectedRecord.id}/pay`, { amount: parseFloat(paymentAmount), method: paymentMethod });
      await fetchFees();
      setShowPaymentModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns: Column<FeeRecord>[] = [
    { header: 'Student', accessor: (record) => <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100"><User className="w-5 h-5" /></div><div><div className="font-bold text-gray-900">{record.studentName}</div><div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{record.className}</div></div></div> },
    { header: 'Month', accessor: (record) => <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-widest border border-gray-100">{record.month}</span> },
    { header: 'Total Amount', accessor: (record) => <span className="font-bold">${record.amount.toLocaleString()}</span> },
    { header: 'Paid', accessor: (record) => <span className="font-bold text-green-600">${record.paidAmount.toLocaleString()}</span> },
    { header: 'Status', accessor: (record) => <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${record.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : record.status === 'Partially Paid' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{record.status}</span> },
  ];

  const totalCollected = records.reduce((accumulator, record) => accumulator + record.paidAmount, 0);
  const totalDue = records.reduce((accumulator, record) => accumulator + (record.amount - record.paidAmount), 0);
  const collectionRate = records.length ? ((totalCollected / records.reduce((accumulator, record) => accumulator + record.amount, 0)) * 100).toFixed(1) : '0.0';
  const stats = [
    { label: 'Total Collected', value: `$${totalCollected.toLocaleString()}`, color: 'text-green-600' },
    { label: 'Outstanding', value: `$${totalDue.toLocaleString()}`, color: 'text-red-600' },
    { label: 'Efficiency', value: `${collectionRate}%`, color: 'text-blue-600' },
  ];

  const filteredRecords = records.filter((record) => record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || record.className.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="p-6">
        <div className="mb-6 border-b border-gray-100">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('records')} className={`px-6 py-4 font-bold uppercase text-xs tracking-widest border-b-2 transition-all ${activeTab === 'records' ? 'border-[#2D6CDF] text-[#2D6CDF]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Fee Records</button>
            <button onClick={() => setActiveTab('config')} className={`px-6 py-4 font-bold uppercase text-xs tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'config' ? 'border-[#2D6CDF] text-[#2D6CDF]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><Settings className="w-4 h-4" />Configuration</button>
          </div>
        </div>

        {activeTab === 'records' && (
          <GenericTable
            title="Fee Management"
            description="Financial Records & Collection"
            stats={stats}
            data={filteredRecords}
            columns={columns}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onView={(record) => { setSelectedRecord(record); setPaymentAmount(String(record.amount - record.paidAmount)); setShowPaymentModal(true); }}
            addLabel="Download Report"
            isLoading={loading && records.length === 0}
          />
        )}

        {activeTab === 'config' && <FeeConfigurationView onConfigUpdate={fetchFees} />}

        <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Process Payment">
          {selectedRecord && (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Student</p>
                <p className="text-gray-900 font-black text-lg">{selectedRecord.studentName}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Month</p><p className="text-gray-700 font-bold">{selectedRecord.month}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Remaining Due</p><p className="text-red-500 font-black">${(selectedRecord.amount - selectedRecord.paidAmount).toLocaleString()}</p></div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Payment Amount ($)</label>
                <input type="number" value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black text-2xl text-gray-900" />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">{['Cash', 'Card', 'Online'].map((method) => <button key={method} onClick={() => setPaymentMethod(method)} className={`py-3 rounded-xl font-black text-xs transition-all border ${paymentMethod === method ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-black/10' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{method}</button>)}</div>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
                <button onClick={handleProcessPayment} className="w-full py-4 bg-[#2D6CDF] text-white rounded-2xl font-black hover:bg-[#1a4ba8] transition-all shadow-xl shadow-[#2D6CDF]/20 active:scale-95 flex items-center justify-center gap-2"><DollarSign className="w-5 h-5" />Confirm Payment</button>
                <button onClick={() => setShowPaymentModal(false)} className="w-full py-4 text-gray-500 font-black text-xs uppercase tracking-widest hover:text-gray-700 transition-colors">Cancel Transaction</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </RoleGuard>
  );
}
