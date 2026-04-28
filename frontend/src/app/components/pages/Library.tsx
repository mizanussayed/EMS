import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Book as BookIcon, User, X, Edit, Trash2, ArrowLeftRight, Bookmark, Clock, CheckCircle, Info, Library as LibraryIcon } from 'lucide-react';

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

interface LibraryProps {
  token: string;
}

export default function Library({ token }: LibraryProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<BookType[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Science',
    quantity: 1,
    rackNumber: 'A-1'
  });

  const [issueFormData, setIssueFormData] = useState({
    studentId: '',
    bookId: '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [booksRes, issuesRes] = await Promise.all([
        fetch(`${apiUrl}/library/books`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/library/issues`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!booksRes.ok || !issuesRes.ok) throw new Error('Failed to fetch library data');

      const booksData = await booksRes.json();
      const issuesData = await issuesRes.json();

      setBooks(booksData);
      setIssuedBooks(issuesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddBook = async () => {
    try {
      const response = await fetch(`${apiUrl}/library/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...bookFormData, availableQuantity: bookFormData.quantity })
      });
      if (!response.ok) throw new Error('Failed to add book');
      await fetchData();
      setShowAddBookModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleIssueBook = async () => {
    try {
      const response = await fetch(`${apiUrl}/library/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: parseInt(issueFormData.studentId),
          bookId: parseInt(issueFormData.bookId),
          issueDate: new Date().toISOString(),
          dueDate: new Date(issueFormData.dueDate).toISOString(),
          status: 'Issued'
        })
      });
      if (!response.ok) throw new Error('Failed to issue book');
      await fetchData();
      setShowIssueModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReturnBook = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/library/issues/${id}/return`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to return book');
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-gray-900 font-black text-3xl mb-2">Library System</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Knowledge Hub Management</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowIssueModal(true)}
            className="px-6 py-3 bg-white border border-[#2D6CDF] text-[#2D6CDF] rounded-2xl hover:bg-blue-50 flex items-center justify-center gap-2 font-black transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeftRight className="w-5 h-5" />
            Issue New Book
          </button>
          <button 
            onClick={() => setShowAddBookModal(true)}
            className="px-6 py-3 bg-[#2D6CDF] text-white rounded-2xl hover:bg-[#1a4ba8] flex items-center justify-center gap-2 font-black shadow-xl shadow-[#2D6CDF]/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add to Inventory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search books by title or author..." 
                  className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                />
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBooks.map(book => (
                  <div key={book.id} className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all group relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <BookIcon className="w-32 h-32 text-[#2D6CDF]" />
                    </div>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2D6CDF] flex-shrink-0">
                        <BookIcon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{book.category}</p>
                        <h4 className="text-gray-900 font-black text-xl mb-1">{book.title}</h4>
                        <p className="text-gray-500 font-bold text-sm">by {book.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total</p>
                          <p className="text-gray-900 font-black">{book.quantity}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Avail</p>
                          <p className="text-green-600 font-black">{book.availableQuantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Location</p>
                        <div className="flex items-center gap-1 text-gray-900 font-black">
                          <Bookmark className="w-3 h-3 text-[#2D6CDF]" />
                          {book.rackNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-black/20 relative overflow-hidden">
            <LibraryIcon className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
            <h3 className="font-black text-2xl mb-8 relative z-10">Current Loans</h3>
            <div className="space-y-6 relative z-10">
              {issuedBooks.map(issue => (
                <div key={issue.id} className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 group/item">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <User className="w-4 h-4" />
                    </div>
                    <p className="font-black text-sm">{issue.studentName}</p>
                  </div>
                  <p className="text-gray-400 text-xs font-bold mb-4">{issue.bookTitle}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400">
                      <Clock className="w-3 h-3" />
                      Due {new Date(issue.dueDate).toLocaleDateString()}
                    </div>
                    {issue.status === 'Issued' && (
                      <button 
                        onClick={() => handleReturnBook(issue.id)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-colors"
                      >
                        Return
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {issuedBooks.length === 0 && (
                <div className="py-12 text-center">
                  <Info className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40 font-bold">No active loans</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-gray-900 font-black text-2xl">Add New Book</h2>
              <button onClick={() => setShowAddBookModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Book Title *</label>
                  <input
                    type="text"
                    value={bookFormData.title}
                    onChange={(e) => setBookFormData({...bookFormData, title: e.target.value})}
                    placeholder="e.g. A Brief History of Time"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Author *</label>
                  <input
                    type="text"
                    value={bookFormData.author}
                    onChange={(e) => setBookFormData({...bookFormData, author: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">ISBN</label>
                  <input
                    type="text"
                    value={bookFormData.isbn}
                    onChange={(e) => setBookFormData({...bookFormData, isbn: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Quantity</label>
                  <input
                    type="number"
                    value={bookFormData.quantity}
                    onChange={(e) => setBookFormData({...bookFormData, quantity: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Rack Location</label>
                  <input
                    type="text"
                    value={bookFormData.rackNumber}
                    onChange={(e) => setBookFormData({...bookFormData, rackNumber: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-bold"
                  />
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
              <button
                onClick={() => setShowAddBookModal(false)}
                className="px-8 py-3 text-gray-500 font-bold hover:bg-white rounded-2xl transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleAddBook}
                className="px-10 py-3 bg-[#2D6CDF] text-white rounded-2xl font-black hover:bg-[#1a4ba8] transition-all shadow-xl shadow-[#2D6CDF]/20 active:scale-95"
              >
                Save Book
              </button>
            </div>
          </div>
        </div>
      )}

      {showIssueModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-gray-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-gray-900 font-black text-2xl">Issue Book</h2>
              <button onClick={() => setShowIssueModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Student ID</label>
                <input
                  type="number"
                  value={issueFormData.studentId}
                  onChange={(e) => setIssueFormData({...issueFormData, studentId: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Select Book</label>
                <select
                  value={issueFormData.bookId}
                  onChange={(e) => setIssueFormData({...issueFormData, bookId: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black"
                >
                  <option value="">-- Choose Book --</option>
                  {books.filter(b => b.availableQuantity > 0).map(b => (
                    <option key={b.id} value={b.id}>{b.title} ({b.availableQuantity} left)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Return Due Date</label>
                <input
                  type="date"
                  value={issueFormData.dueDate}
                  onChange={(e) => setIssueFormData({...issueFormData, dueDate: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF] transition-all font-black"
                />
              </div>
            </div>
            <div className="p-8 border-t border-gray-100 flex flex-col gap-3 bg-gray-50/50">
              <button
                onClick={handleIssueBook}
                disabled={!issueFormData.studentId || !issueFormData.bookId}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
              >
                Confirm Issuance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
