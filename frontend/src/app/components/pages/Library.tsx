import { useState } from 'react';
import { Plus, Search, Book, User, X, Edit, Trash2, ArrowLeftRight } from 'lucide-react';

interface BookType {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  copies: number;
  available: number;
  issued: number;
}

interface IssuedBook {
  student: string;
  rollNo: string;
  book: string;
  issueDate: string;
  dueDate: string;
  status: string;
}

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);

  const [books, setBooks] = useState<BookType[]>([
    { id: 'BK001', title: 'Introduction to Physics', author: 'John Doe', category: 'Science', isbn: '978-1-234-56789-0', copies: 15, available: 10, issued: 5 },
    { id: 'BK002', title: 'Advanced Mathematics', author: 'Jane Smith', category: 'Mathematics', isbn: '978-1-234-56789-1', copies: 20, available: 15, issued: 5 },
    { id: 'BK003', title: 'English Grammar', author: 'Robert Brown', category: 'Language', isbn: '978-1-234-56789-2', copies: 25, available: 20, issued: 5 },
    { id: 'BK004', title: 'World History', author: 'Sarah Wilson', category: 'History', isbn: '978-1-234-56789-3', copies: 18, available: 12, issued: 6 },
  ]);

  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([
    { student: 'John Smith', rollNo: '2025001', book: 'Introduction to Physics', issueDate: '2025-11-15', dueDate: '2025-12-15', status: 'Active' },
    { student: 'Sarah Johnson', rollNo: '2025002', book: 'Advanced Mathematics', issueDate: '2025-11-10', dueDate: '2025-12-10', status: 'Active' },
    { student: 'Michael Brown', rollNo: '2025003', book: 'English Grammar', issueDate: '2025-11-01', dueDate: '2025-12-01', status: 'Overdue' },
  ]);

  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    category: 'Science',
    isbn: '',
    copies: '1',
  });

  const [issueFormData, setIssueFormData] = useState({
    studentName: '',
    rollNo: '',
    bookTitle: '',
  });

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBook = () => {
    const copies = parseInt(bookFormData.copies);
    const newBook: BookType = {
      id: `BK${String(books.length + 1).padStart(3, '0')}`,
      title: bookFormData.title,
      author: bookFormData.author,
      category: bookFormData.category,
      isbn: bookFormData.isbn,
      copies: copies,
      available: copies,
      issued: 0,
    };
    setBooks([...books, newBook]);
    setShowAddBookModal(false);
    resetBookForm();
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const handleIssueBook = () => {
    const book = books.find(b => b.title === issueFormData.bookTitle);
    if (book && book.available > 0) {
      const issueDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const newIssue: IssuedBook = {
        student: issueFormData.studentName,
        rollNo: issueFormData.rollNo,
        book: issueFormData.bookTitle,
        issueDate,
        dueDate,
        status: 'Active',
      };

      setIssuedBooks([...issuedBooks, newIssue]);
      setBooks(books.map(b =>
        b.title === issueFormData.bookTitle
          ? { ...b, available: b.available - 1, issued: b.issued + 1 }
          : b
      ));

      setShowIssueModal(false);
      resetIssueForm();
      alert('Book issued successfully!');
    }
  };

  const handleReturnBook = (issue: IssuedBook) => {
    if (confirm('Mark this book as returned?')) {
      setIssuedBooks(issuedBooks.filter(i => i !== issue));
      setBooks(books.map(b =>
        b.title === issue.book
          ? { ...b, available: b.available + 1, issued: b.issued - 1 }
          : b
      ));
      alert('Book returned successfully!');
    }
  };

  const resetBookForm = () => {
    setBookFormData({
      title: '',
      author: '',
      category: 'Science',
      isbn: '',
      copies: '1',
    });
  };

  const resetIssueForm = () => {
    setIssueFormData({
      studentName: '',
      rollNo: '',
      bookTitle: '',
    });
  };

  const totalBooks = books.reduce((acc, b) => acc + b.copies, 0);
  const availableBooks = books.reduce((acc, b) => acc + b.available, 0);
  const issuedBooksCount = books.reduce((acc, b) => acc + b.issued, 0);
  const overdueCount = issuedBooks.filter(i => i.status === 'Overdue').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Library Management</h1>
        <p className="text-gray-600">Manage library books and issuance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Books</p>
          <p className="text-gray-900 mt-1">{totalBooks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Available</p>
          <p className="text-green-600 mt-1">{availableBooks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Issued</p>
          <p className="text-blue-600 mt-1">{issuedBooksCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Overdue</p>
          <p className="text-red-600 mt-1">{overdueCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowIssueModal(true)}
              className="px-4 py-2 border border-[#2D6CDF] text-[#2D6CDF] rounded-lg hover:bg-blue-50 flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Issue Book
            </button>
            <button
              onClick={() => setShowAddBookModal(true)}
              className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Book
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">Book Inventory</h2>
          <div className="space-y-3">
            {filteredBooks.map((book) => (
              <div key={book.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Book className="w-5 h-5 text-[#2D6CDF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author} • {book.category}</p>
                      <p className="text-xs text-gray-400 mt-1">ISBN: {book.isbn}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-200 text-sm">
                  <div>
                    <span className="text-gray-600">Total: </span>
                    <span className="text-gray-900">{book.copies}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Available: </span>
                    <span className="text-green-600">{book.available}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Issued: </span>
                    <span className="text-blue-600">{book.issued}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">Recently Issued Books</h2>
          <div className="space-y-3">
            {issuedBooks.map((issue, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{issue.student}</p>
                    <p className="text-sm text-gray-500">{issue.rollNo}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{issue.book}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Due: {issue.dueDate}</span>
                  <div className="flex gap-2 items-center">
                    <span className={`px-2 py-1 rounded-full ${
                      issue.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {issue.status}
                    </span>
                    <button
                      onClick={() => handleReturnBook(issue)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      Return
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Add New Book</h2>
              <button onClick={() => setShowAddBookModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">Book Title *</label>
                  <input
                    type="text"
                    value={bookFormData.title}
                    onChange={(e) => setBookFormData({...bookFormData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Author *</label>
                  <input
                    type="text"
                    value={bookFormData.author}
                    onChange={(e) => setBookFormData({...bookFormData, author: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Category *</label>
                  <select
                    value={bookFormData.category}
                    onChange={(e) => setBookFormData({...bookFormData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option>Science</option>
                    <option>Mathematics</option>
                    <option>Language</option>
                    <option>History</option>
                    <option>Fiction</option>
                    <option>Reference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">ISBN *</label>
                  <input
                    type="text"
                    value={bookFormData.isbn}
                    onChange={(e) => setBookFormData({...bookFormData, isbn: e.target.value})}
                    placeholder="978-X-XXX-XXXXX-X"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Number of Copies *</label>
                  <input
                    type="number"
                    min="1"
                    value={bookFormData.copies}
                    onChange={(e) => setBookFormData({...bookFormData, copies: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddBookModal(false);
                  resetBookForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBook}
                disabled={!bookFormData.title || !bookFormData.author || !bookFormData.isbn}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900">Issue Book</h2>
              <button onClick={() => setShowIssueModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Student Name *</label>
                  <input
                    type="text"
                    value={issueFormData.studentName}
                    onChange={(e) => setIssueFormData({...issueFormData, studentName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Roll Number *</label>
                  <input
                    type="text"
                    value={issueFormData.rollNo}
                    onChange={(e) => setIssueFormData({...issueFormData, rollNo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Select Book *</label>
                  <select
                    value={issueFormData.bookTitle}
                    onChange={(e) => setIssueFormData({...issueFormData, bookTitle: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
                  >
                    <option value="">-- Select a book --</option>
                    {books.filter(b => b.available > 0).map(book => (
                      <option key={book.id} value={book.title}>
                        {book.title} (Available: {book.available})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowIssueModal(false);
                  resetIssueForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleIssueBook}
                disabled={!issueFormData.studentName || !issueFormData.rollNo || !issueFormData.bookTitle}
                className="px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Issue Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
