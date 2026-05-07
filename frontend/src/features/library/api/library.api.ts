import { apiClient } from '@/services/http/apiClient';
import type { BookType, IssuedBook, LibrarySummary } from '../model/library.types';

export interface BookInput {
  title: string;
  author: string;
  isbn?: string;
  category: string;
  quantity: number;
  rackNumber?: string;
}

export interface IssueInput {
  studentId: number;
  bookId: number;
  dueDate: string;
  issueDate?: string;
  status?: string;
}

export const libraryApi = {
  getSummary: async () => {
    const [booksResponse, issuesResponse] = await Promise.all([
      apiClient.get<BookType[]>('/library/books'),
      apiClient.get<IssuedBook[]>('/library/issues'),
    ]);

    const summary: LibrarySummary = {
      books: booksResponse.data,
      issuedBooks: issuesResponse.data,
    };

    return summary;
  },
  createBook: async (payload: BookInput) => {
    const response = await apiClient.post<BookType>('/library/books', { ...payload, availableQuantity: payload.quantity });
    return response.data;
  },
  issueBook: async (payload: IssueInput) => {
    const response = await apiClient.post<IssuedBook>('/library/issues', payload);
    return response.data;
  },
  returnBook: async (id: number) => {
    const response = await apiClient.put<void>(`/library/issues/${id}/return`, {});
    return response.data;
  },
};