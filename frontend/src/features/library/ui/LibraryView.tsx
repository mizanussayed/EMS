import { useState, useEffect, useCallback } from 'react';
import { Book as BookIcon, User, Clock, Info } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import GenericTable, { type Column } from '@/components/ui/GenericTable';
import Modal from '@/components/ui/Modal';
import GenericForm, { type FormField } from '@/components/ui/GenericForm';
import { ToastContainer } from '@/components/ui/Toast';

interface BookType {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  rackNumber: string;
}

interface IssuedBook {
  id: number;
  bookId: number;
  bookTitle: string;
  studentId: number;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
}

const bookFormFields: FormField[] = [
  { name: 'title', label: 'Book Title', type: 'text', placeholder: 'e.g., A Brief History of Time', required: true, colSpan: 2 },
  { name: 'author', label: 'Author', type: 'text', placeholder: 'Stephen Hawking', required: true },
  { name: 'isbn', label: 'ISBN', type: 'text', placeholder: '978-0553109580' },
  { name: 'category', label: 'Category', type: 'select', options: [{ label: 'Science', value: 'Science' }, { label: 'History', value: 'History' }, { label: 'Literature', value: 'Literature' }, { label: 'Mathematics', value: 'Mathematics' }] },
  { name: 'quantity', label: 'Total Quantity', type: 'number', placeholder: '1' },
  { name: 'rackNumber', label: 'Rack Location', type: 'text', placeholder: 'A-1' },
];

export default function LibraryView() {
  const api = useApi();
  const { auth } = useAuth();
  const { toasts, remove, success, error } = useToast();
  const [books, setBooks] = useState<BookType[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueFormData, setIssueFormData] = useState({ studentId: '', bookId: '', dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [booksData, issuesData] = await Promise.all([api.get('/library/books'), api.get('/library/issues')]);
      setBooks(booksData);
      setIssuedBooks(issuesData);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddBook = async (data: any) => {
    try {
      await api.post('/library/books', { ...data, availableQuantity: data.quantity });
      await fetchData();
      setShowAddBookModal(false);
      success('Book added to library successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleIssueBook = async () => {
    try {
      await api.post('/library/issues', { studentId: parseInt(issueFormData.studentId), bookId: parseInt(issueFormData.bookId), issueDate: new Date().toISOString(), dueDate: new Date(issueFormData.dueDate).toISOString(), status: 'Issued' });
      await fetchData();
      setShowIssueModal(false);
      success('Book issued successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleReturnBook = async (id: number) => {
    try {
      await api.put(`/library/issues/${id}/return`, {});
      await fetchData();
      success('Book returned successfully.');
    } catch (err: any) {
      error(err.message);
    }
  };

  const columns: Column<BookType>[] = [
    { header: 'Book Info', accessor: (book) => <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2D6CDF] font-bold"><BookIcon className="w-5 h-5" /></div><div><div className="font-bold text-gray-900">{book.title}</div><div className="text-xs text-gray-400">by {book.author}</div></div></div> },
    { header: 'ISBN', accessor: 'isbn' },
    { header: 'Category', accessor: (book) => <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold">{book.category}</span> },
    { header: 'Availability', accessor: (book) => <div className="flex flex-col"><span className="font-bold text-gray-900">{book.availableQuantity} / {book.quantity}</span><span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Available</span></div> },
    { header: 'Location', accessor: (book) => <span className="font-bold text-gray-700">{book.rackNumber}</span> },
  ];

  const stats = [
    { label: 'Total Books', value: books.reduce((accumulator, book) => accumulator + book.quantity, 0) },
    { label: 'Active Loans', value: issuedBooks.length, color: 'text-orange-600' },
    { label: 'Available', value: books.reduce((accumulator, book) => accumulator + book.availableQuantity, 0), color: 'text-green-600' },
    { label: 'Categories', value: new Set(books.map((book) => book.category)).size },
  ];

  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <GenericTable
            title="Library Management"
            description="Manage books and inventory"
            stats={stats}
            data={filteredBooks}
            columns={columns}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAdd={() => setShowAddBookModal(true)}
            addLabel="Add Book"
            onView={(book) => { setIssueFormData({ ...issueFormData, bookId: String(book.id) }); setShowIssueModal(true); }}
            isLoading={loading && books.length === 0}
            canAdd={auth?.role === 'admin'}
            canView={auth?.role === 'admin'}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden min-h-[600px]">
            <h3 className="font-black text-2xl mb-8">Active Loans</h3>
            <div className="space-y-6">
              {issuedBooks.map((issue) => (
                <div key={issue.id} className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3"><User className="w-4 h-4 text-blue-400" /><p className="font-black text-sm">{issue.studentName}</p></div>
                  <p className="text-gray-400 text-xs font-bold mb-4">{issue.bookTitle}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400"><Clock className="w-3 h-3" />Due {new Date(issue.dueDate).toLocaleDateString()}</div>
                    {auth?.role === 'admin' && <button onClick={() => handleReturnBook(issue.id)} className="px-3 py-1.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-colors">Return</button>}
                  </div>
                </div>
              ))}
              {issuedBooks.length === 0 && <div className="py-12 text-center text-white/40"><Info className="w-12 h-12 mx-auto mb-4 opacity-20" /><p className="font-bold">No active loans</p></div>}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showAddBookModal} onClose={() => setShowAddBookModal(false)} title="Add New Book">
        <GenericForm fields={bookFormFields} initialData={{ quantity: 1, category: 'Science', rackNumber: 'A-1' }} onSubmit={handleAddBook} onCancel={() => setShowAddBookModal(false)} submitLabel="Save to Inventory" />
      </Modal>

      <Modal isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} title="Issue Book">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Student ID</label>
            <input type="number" value={issueFormData.studentId} onChange={(event) => setIssueFormData({ ...issueFormData, studentId: event.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black" />
          </div>
          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Return Due Date</label>
            <input type="date" value={issueFormData.dueDate} onChange={(event) => setIssueFormData({ ...issueFormData, dueDate: event.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black" />
          </div>
          <button onClick={handleIssueBook} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95">Confirm Issuance</button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
