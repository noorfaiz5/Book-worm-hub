import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { signOutUser } from '@/lib/firebase';
import { BookOpen, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  onAddBook: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onAddBook }) => {
  const { user } = useAuth();
  const [location] = useLocation();

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/books', label: 'My Books' },
    { href: '/challenge', label: 'Reading Challenge' },
    { href: '/stats', label: 'Statistics' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-sage-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-sage-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">BookNest</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`transition-colors ${
                  location === item.href 
                    ? 'text-sage-600 font-medium border-b-2 border-sage-500 pb-1' 
                    : 'text-gray-600 hover:text-sage-600'
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={onAddBook}
              className="bg-sage-500 hover:bg-sage-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3">
                  <img 
                    src={user.photoURL || ''} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium hidden sm:block">
                    {user.displayName?.split(' ')[0]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
