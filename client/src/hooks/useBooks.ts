import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { type Book, type InsertBook } from '@shared/schema';

interface AddBookData {
  title: string;
  author: string;
  genre?: string;
  pages?: number;
  status: 'want-to-read' | 'reading' | 'finished';
  currentPage?: number;
  rating?: number;
  dateStarted?: string;
  dateFinished?: string;
}

export const useBooks = () => {
  const { user } = useAuth();

  const booksQuery = useQuery({
    queryKey: ['books', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      const response = await fetch(`/api/books?userId=${user.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      return response.json() as Book[];
    },
    enabled: !!user?.uid,
  });

  const addBook = useMutation({
    mutationFn: async (bookData: AddBookData) => {
      if (!user?.uid) throw new Error('User not authenticated');
      
      const insertData: InsertBook = {
        ...bookData,
        userId: user.uid,
        dateStarted: bookData.dateStarted ? new Date(bookData.dateStarted) : undefined,
        dateFinished: bookData.dateFinished ? new Date(bookData.dateFinished) : undefined,
      };
      
      const response = await apiRequest('POST', '/api/books', insertData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books', user?.uid] });
    },
  });

  const updateBook = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Book> & { id: string }) => {
      const response = await apiRequest('PUT', `/api/books/${id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books', user?.uid] });
    },
  });

  const deleteBook = useMutation({
    mutationFn: async (bookId: string) => {
      const response = await apiRequest('DELETE', `/api/books/${bookId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books', user?.uid] });
    },
  });

  const books = booksQuery.data || [];
  const currentlyReading = books.filter(book => book.status === 'reading');
  const recentlyFinished = books
    .filter(book => book.status === 'finished')
    .sort((a, b) => {
      const dateA = new Date(b.dateFinished || b.updatedAt || 0).getTime();
      const dateB = new Date(a.dateFinished || a.updatedAt || 0).getTime();
      return dateA - dateB;
    })
    .slice(0, 4);

  return {
    books,
    currentlyReading,
    recentlyFinished,
    isLoading: booksQuery.isLoading,
    addBook,
    updateBook,
    deleteBook,
  };
};
