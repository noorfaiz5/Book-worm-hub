import React from 'react';
import { useBooks } from '@/hooks/useBooks';

export const FavoriteGenres: React.FC = () => {
  const { books } = useBooks();
  
  const genreCounts = books.reduce((acc, book) => {
    if (book.genre) {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const maxCount = Math.max(...sortedGenres.map(([, count]) => count));
  
  const colors = [
    { bg: 'bg-sage-100', bar: 'bg-sage-500' },
    { bg: 'bg-terracotta-100', bar: 'bg-terracotta-500' },
    { bg: 'bg-yellow-100', bar: 'bg-yellow-500' },
    { bg: 'bg-purple-100', bar: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-sage-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Favorite Genres</h3>
      
      {sortedGenres.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No genres tracked yet.</p>
          <p className="text-xs">Add books with genres to see your preferences!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedGenres.map(([genre, count], index) => {
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const color = colors[index] || colors[0];
            
            return (
              <div key={genre} className="flex items-center justify-between">
                <span className="text-gray-700">{genre}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-16 ${color.bg} rounded-full h-2`}>
                    <div 
                      className={`${color.bar} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-6">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
