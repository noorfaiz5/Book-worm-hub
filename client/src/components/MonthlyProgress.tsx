import React from 'react';
import { useBooks } from '@/hooks/useBooks';
import { format } from 'date-fns';

export const MonthlyProgress: React.FC = () => {
  const { books } = useBooks();
  
  const currentMonth = format(new Date(), 'MMMM yyyy');
  const currentMonthBooks = books.filter(book => {
    if (book.status !== 'finished' || !book.dateFinished) return false;
    const finishedDate = new Date(book.dateFinished);
    const now = new Date();
    return finishedDate.getMonth() === now.getMonth() && finishedDate.getFullYear() === now.getFullYear();
  });

  const target = 6; // Default monthly target
  const completed = currentMonthBooks.length;
  const percentage = Math.round((completed / target) * 100);
  const totalPages = currentMonthBooks.reduce((sum, book) => sum + (book.pages || 0), 0);
  const avgRating = currentMonthBooks.length > 0 
    ? (currentMonthBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / currentMonthBooks.length).toFixed(1)
    : '0';
  const genres = new Set(currentMonthBooks.map(book => book.genre).filter(Boolean)).size;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-sage-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{currentMonth} Reading Progress</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-sage-600">{completed}</div>
          <div className="text-sm text-gray-500">of {target} books</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-sage-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-sage-500 to-sage-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-sage-50 rounded-lg">
          <div className="text-lg font-semibold text-sage-600">{totalPages}</div>
          <div className="text-xs text-gray-600">Pages Read</div>
        </div>
        <div className="text-center p-3 bg-terracotta-50 rounded-lg">
          <div className="text-lg font-semibold text-terracotta-600">{avgRating}</div>
          <div className="text-xs text-gray-600">Avg Rating</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-lg font-semibold text-yellow-600">{genres}</div>
          <div className="text-xs text-gray-600">Genres</div>
        </div>
      </div>
    </div>
  );
};
