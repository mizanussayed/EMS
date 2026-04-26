import { useState } from 'react';
import { DollarSign, Download, CheckCircle, Clock, X } from 'lucide-react';

interface FeeRecord {
  student: string;
  rollNo: string;
  class: string;
  tuition: number;
  library: number;
  lab: number;
  sports: number;
  total: number;
  paid: number;
  due: number;
  status: string;
  date: string;
}

export default function Fees() {
  const [filterClass, setFilterClass] = useState('All Classes');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([
    { student: 'John Smith', rollNo: '2025001', class: 'Grade 10A', tuition: 5000, library: 200, lab: 300, sports: 150, total: 5650, paid: 5650, due: 0, status: 'Paid', date: '2025-11-01' },
    { student: 'Sarah Johnson', rollNo: '2025002', class: 'Grade 10A', tuition: 5000, library: 200, lab: 300, sports: 150, total: 5650, paid: 5650, due: 0, status: 'Paid', date: '2025-11-05' },
    { student: 'Michael Brown', rollNo: '2025003', class: 'Grade 9B', tuition: 4500, library: 200, lab: 300, sports: 150, total: 5150, paid: 2000, due: 3150, status: 'Partial', date: '2025-11-10' },
    { student: 'Emily Davis', rollNo: '2025004', class: 'Grade 10B', tuition: 5000, library: 200, lab: 300, sports: 150, total: 5650, paid: 0, due: 5650, status: 'Pending', date: '-' },
  ]);

  const filteredRecords = feeRecords.filter(record => {
    const matchesClass = filterClass === 'All Classes' || record.class === filterClass;
    const matchesStatus = filterStatus === 'All Status' || record.status === filterStatus;
    return matchesClass && matchesStatus;
  });

  const handleCollectPayment = (record: FeeRecord) => {
    setSelectedRecord(record);
    setPaymentAmount(String(record.due));
    setShowPaymentModal(true);
  };

  const handleProcessPayment = () => {
    if (selectedRecord && paymentAmount) {
      const amount = parseFloat(paymentAmount);
      const newPaid = selectedRecord.paid + amount;
      const newDue = selectedRecord.total - newPaid;
      const newStatus = newDue === 0 ? 'Paid' : newDue < selectedRecord.total ? 'Partial' : 'Pending';
      const newDate = new Date().toISOString().split('T')[0];

      setFeeRecords(feeRecords.map(record =>
        record.rollNo === selectedRecord.rollNo
          ? { ...record, paid: newPaid, due: newDue, status: newStatus, date: newDate }
          : record
      ));

      setShowPaymentModal(false);
      setSelectedRecord(null);
      setPaymentAmount('');
      alert(`Payment of $${amount} processed successfully!`);
    }
  };

  const handleExportReport = () => {
    alert('Exporting fee report to CSV...');
  };

  const totalCollected = feeRecords.reduce((acc, r) => acc + r.paid, 0);
  const totalDue = feeRecords.reduce((acc, r) => acc + r.due, 0);
  const collectionRate = ((totalCollected / (totalCollected + totalDue)) * 100).toFixed(1);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Fee Management</h1>
        <p className="text-gray-600">Manage student fees and payments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Collected</p>
          <p className="text-green-600 mt-1">${totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Due</p>
          <p className="text-red-600 mt-1">${totalDue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Collection Rate</p>
          <p className="text-blue-600 mt-1">{collectionRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-orange-600 mt-1">{feeRecords.length}</p>
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
            >
              <option>All Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Partial</option>
            </select>
          </div>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
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
                <th className="px-6 py-4 text-right text-gray-700">Total Fee</th>
                <th className="px-6 py-4 text-right text-gray-700">Paid</th>
                <th className="px-6 py-4 text-right text-gray-700">Due</th>
                <th className="px-6 py-4 text-center text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{record.rollNo}</td>
                  <td className="px-6 py-4 text-gray-900">{record.student}</td>
                  <td className="px-6 py-4 text-gray-600">{record.class}</td>
                  <td className="px-6 py-4 text-right text-gray-900">${record.total}</td>
                  <td className="px-6 py-4 text-right text-green-600">${record.paid}</td>
                  <td className="px-6 py-4 text-right text-red-600">${record.due}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center justify-center gap-1 w-fit mx-auto ${
                      record.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      record.status === 'Partial' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {record.status === 'Paid' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleCollectPayment(record)}
                      disabled={record.status === 'Paid'}
                      className="px-3 py-1 bg-[#2D6CDF] text-white rounded hover:bg-[#1a4ba8] text-sm flex items-center gap-1 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DollarSign className="w-4 h-4" />
                      Collect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No fee records found matching your criteria
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Collect Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Student: <span className="text-gray-900">{selectedRecord.student}</span></p>
                <p className="text-sm text-gray-600">Roll No: <span className="text-gray-900">{selectedRecord.rollNo}</span></p>
                <p className="text-sm text-gray-600">Class: <span className="text-gray-900">{selectedRecord.class}</span></p>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Fee:</span>
                  <span className="text-gray-900">${selectedRecord.total}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Already Paid:</span>
                  <span className="text-green-600">${selectedRecord.paid}</span>
                </div>
                <div className="flex justify-between mb-2 pt-2 border-t">
                  <span className="text-gray-900">Amount Due:</span>
                  <span className="text-red-600">${selectedRecord.due}</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Payment Amount *</label>
                <input
                  type="number"
                  min="0"
                  max={selectedRecord.due}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || parseFloat(paymentAmount) > selectedRecord.due}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
