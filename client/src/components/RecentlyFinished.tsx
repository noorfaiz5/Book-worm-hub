import React from 'react';
import { useBooks } from '@/hooks/useBooks';
import { Star } from 'lucide-react';
import { format } from 'date-fns';

export const RecentlyFinished: React.FC = () => {
  const { recentlyFinished } = useBooks();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-sage-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Recently Finished</h3>
        <a href="/books" className="text-sage-600 hover:text-sage-700 text-sm font-medium">
          View All
        </a>
      </div>
      
      {recentlyFinished.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No finished books yet this month.</p>
          <p className="text-sm">Complete a book to see it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {recentlyFinished.map((book) => (
            <div 
              key={book.id} 
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-10 bg-gradient-to-br from-sage-200 to-sage-300 rounded shadow-sm flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-sage-700">📚</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-xs text-gray-800 truncate leading-tight">
                    {book.title}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">
                    {book.author}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {renderStars(book.rating || 0)}
                </div>
                <span className="text-xs text-gray-500">
                  {book.dateFinished ? format(new Date(book.dateFinished), 'MMM d') : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
