import React from 'react';
import { useBooks } from '@/hooks/useBooks';
import { Edit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export const CurrentlyReading: React.FC = () => {
  const { currentlyReading, updateBook } = useBooks();

  const handleMarkAsFinished = async (book: any) => {
    try {
      await updateBook.mutateAsync({
        id: book.id,
        status: 'finished',
        dateFinished: new Date(),
        currentPage: book.pages || book.currentPage,
      });
    } catch (error) {
      console.error('Error marking book as finished:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-sage-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Currently Reading</h3>
      
      {currentlyReading.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No books currently being read.</p>
          <p className="text-sm">Start a new book to track your progress!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentlyReading.map((book, index) => {
            const progress = book.pages && book.currentPage 
              ? Math.round((book.currentPage / book.pages) * 100) 
              : 0;
            const gradientClass = index % 2 === 0 
              ? 'from-sage-50 to-terracotta-50' 
              : 'from-terracotta-50 to-yellow-50';
            const progressColorClass = index % 2 === 0 
              ? 'from-sage-500 to-sage-600' 
              : 'from-terracotta-500 to-terracotta-600';

            return (
              <div 
                key={book.id} 
                className={`flex gap-4 p-4 bg-gradient-to-r ${gradientClass} rounded-xl`}
              >
                <div className="w-16 h-24 bg-gradient-to-br from-sage-200 to-sage-300 rounded shadow-sm flex items-center justify-center">
                  <span className="text-sm font-medium text-sage-700">📖</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{book.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>
                        {book.currentPage || 0} / {book.pages || 0} pages
                      </span>
                    </div>
                    <div className="w-full bg-white bg-opacity-60 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${progressColorClass} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Started {book.dateStarted ? format(new Date(book.dateStarted), 'MMM d') : 'recently'}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-sage-600 hover:text-sage-700 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-terracotta-600 hover:text-terracotta-700 p-1"
                        onClick={() => handleMarkAsFinished(book)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
