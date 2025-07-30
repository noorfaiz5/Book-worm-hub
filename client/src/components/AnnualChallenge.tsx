import React, { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { Trophy, Target, BookOpen, TrendingUp, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const AnnualChallenge: React.FC = () => {
  const { books } = useBooks();
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const yearlyGoal = 30; // This should come from user settings
  const yearlyBooksRead = books.filter(book => {
    if (book.status !== 'finished' || !book.dateFinished) return false;
    return new Date(book.dateFinished).getFullYear() === currentYear;
  }).length;

  const progress = Math.round((yearlyBooksRead / yearlyGoal) * 100);
  const booksToGo = Math.max(0, yearlyGoal - yearlyBooksRead);
  const isOnTrack = yearlyBooksRead >= Math.ceil((yearlyGoal * (new Date().getMonth() + 1)) / 12);
  const daysInYear = new Date(currentYear, 11, 31).getDate() === 31 ? 366 : 365;
  const daysPassed = Math.ceil((Date.now() - new Date(currentYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const expectedBooks = Math.ceil((yearlyGoal * daysPassed) / daysInYear);

  const getMotivationalMessage = () => {
    if (progress >= 100) return "🎉 Challenge Complete! Amazing work!";
    if (progress >= 75) return "Almost there! You're doing fantastic!";
    if (progress >= 50) return "Halfway there! Keep up the great momentum!";
    if (progress >= 25) return "Great start! You're building a solid reading habit!";
    return "Every book counts! Start your reading journey today!";
  };

  const getProgressColor = () => {
    if (progress >= 75) return "from-emerald-500 to-emerald-600";
    if (progress >= 50) return "from-sage-500 to-sage-600";
    if (progress >= 25) return "from-amber-500 to-amber-600";
    return "from-orange-500 to-orange-600";
  };

  return (
    <Card className="bg-gradient-to-br from-white to-sage-50 border-2 border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{currentYear} Challenge</h3>
              <p className="text-sm text-gray-600">Your yearly reading goal</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-sage-600">{progress}%</div>
            <div className="text-xs text-gray-500">complete</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="text-center mb-6">
          <div className="relative">
            <div className="text-5xl font-bold text-gray-800 mb-1">{yearlyBooksRead}</div>
            <div className="text-lg text-gray-600 mb-4">of {yearlyGoal} books read</div>
            
            {/* Progress Bar */}
            <div className="relative mb-4">
              <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                <div 
                  className={`bg-gradient-to-r ${getProgressColor()} h-4 rounded-full transition-all duration-1000 ease-out shadow-sm`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow-sm">
                  {yearlyBooksRead}/{yearlyGoal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-lg p-3 border border-sage-100">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-sage-500" />
              <span className="text-sm font-medium text-gray-700">Remaining</span>
            </div>
            <div className="text-xl font-bold text-gray-800">{booksToGo}</div>
            <div className="text-xs text-gray-500">books to go</div>
          </div>
          
          <div className="bg-white rounded-lg p-3 border border-sage-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-4 h-4 ${isOnTrack ? 'text-emerald-500' : 'text-orange-500'}`} />
              <span className="text-sm font-medium text-gray-700">Status</span>
            </div>
            <div className={`text-lg font-bold ${isOnTrack ? 'text-emerald-600' : 'text-orange-600'}`}>
              {isOnTrack ? 'On Track' : 'Behind'}
            </div>
            <div className="text-xs text-gray-500">
              Expected: {expectedBooks}
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-sage-500 to-sage-600 rounded-xl p-4 mb-4 text-white text-center">
          <Star className="w-5 h-5 mx-auto mb-2 text-yellow-300" />
          <p className="text-sm font-medium">{getMotivationalMessage()}</p>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => setShowGoalEditor(!showGoalEditor)}
          className="w-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white font-medium transition-all duration-300"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {showGoalEditor ? 'Cancel' : 'Update Reading Goal'}
        </Button>

        {/* Goal Editor (if shown) */}
        {showGoalEditor && (
          <div className="mt-4 p-4 bg-sage-50 rounded-lg border border-sage-200">
            <p className="text-sm text-gray-600 mb-3">Set your {currentYear} reading goal:</p>
            <div className="flex gap-2">
              <input 
                type="number" 
                defaultValue={yearlyGoal}
                className="flex-1 px-3 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                placeholder="Number of books"
              />
              <Button size="sm" className="bg-sage-500 hover:bg-sage-600">
                Save
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
