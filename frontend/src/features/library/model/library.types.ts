export interface BookType {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  rackNumber: string;
}

export interface IssuedBook {
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

export interface LibrarySummary {
  books: BookType[];
  issuedBooks: IssuedBook[];
}