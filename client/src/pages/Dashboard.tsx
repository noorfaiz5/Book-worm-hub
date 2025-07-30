import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MonthlyProgress } from '@/components/MonthlyProgress';
import { RecentlyFinished } from '@/components/RecentlyFinished';
import { CurrentlyReading } from '@/components/CurrentlyReading';
import { AnnualChallenge } from '@/components/AnnualChallenge';
import { QuickStats } from '@/components/QuickStats';
import { FavoriteGenres } from '@/components/FavoriteGenres';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const currentMonth = format(new Date(), 'MMMM yyyy');
  const firstName = user?.displayName?.split(' ')[0] || 'Reader';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Good morning, {firstName}! 📚
        </h1>
        <p className="text-gray-600">
          Let's continue your reading journey for {currentMonth}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <MonthlyProgress />
          <RecentlyFinished />
          <CurrentlyReading />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <AnnualChallenge />
          <QuickStats />
          <FavoriteGenres />
        </div>
      </div>
    </main>
  );
};
