import React from 'react';
import { useBooks } from '@/hooks/useBooks';
import { Calendar, Star, Bookmark, Tags } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const { books } = useBooks();
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthBooks = books.filter(book => {
    if (book.status !== 'finished' || !book.dateFinished) return false;
    const finishedDate = new Date(book.dateFinished);
    return finishedDate.getMonth() === currentMonth && finishedDate.getFullYear() === currentYear;
  });

  const finishedBooks = books.filter(book => book.status === 'finished');
  const totalPages = finishedBooks.reduce((sum, book) => sum + (book.pages || 0), 0);
  const avgRating = finishedBooks.length > 0 
    ? (finishedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / finishedBooks.length).toFixed(1)
    : '0.0';
  const uniqueGenres = new Set(books.map(book => book.genre).filter(Boolean)).size;

  const stats = [
    {
      icon: Calendar,
      iconBg: 'bg-sage-100',
      iconColor: 'text-sage-600',
      label: 'This Month',
      value: `${thisMonthBooks.length} books`,
    },
    {
      icon: Star,
      iconBg: 'bg-terracotta-100',
      iconColor: 'text-terracotta-600',
      label: 'Avg Rating',
      value: avgRating,
    },
    {
      icon: Bookmark,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      label: 'Total Pages',
      value: totalPages.toLocaleString(),
    },
    {
      icon: Tags,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      label: 'Genres',
      value: uniqueGenres.toString(),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-sage-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`${stat.iconColor} w-4 h-4`} />
              </div>
              <span className="text-gray-700">{stat.label}</span>
            </div>
            <span className="font-semibold text-gray-800">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
