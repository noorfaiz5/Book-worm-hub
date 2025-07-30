import React from 'react';
import { signInWithGoogle } from '@/lib/firebase';
import { BookOpen } from 'lucide-react';

interface AuthModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const handleSignIn = async () => {
    try {
      console.log('Starting Google sign in...');
      const result = await signInWithGoogle();
      console.log('Sign in result:', result);
      // If popup succeeded, close modal immediately
      if (result?.user) {
        console.log('Authentication successful:', result.user.email);
        onClose();
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-sage-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to BookNest</h2>
          <p className="text-gray-600">Track your reading journey with warmth and simplicity</p>
        </div>
        
        <button 
          onClick={handleSignIn}
          className="w-full bg-white border-2 border-gray-200 hover:border-sage-300 rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-colors duration-200 mb-4"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
          <span className="font-medium text-gray-700">Continue with Google</span>
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
