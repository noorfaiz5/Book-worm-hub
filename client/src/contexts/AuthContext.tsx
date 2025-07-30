import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, handleAuthRedirect } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Handle redirect result first
    handleAuthRedirect()
      .then((result) => {
        console.log('Redirect result:', result);
        if (result?.user && mounted) {
          console.log('Redirect auth success:', result.user.email, result.user.displayName);
          setUser(result.user);
          setLoading(false);
        } else if (mounted) {
          console.log('No redirect result, checking auth state...');
        }
      })
      .catch((error) => {
        console.error('Auth redirect error:', error);
        if (mounted) setLoading(false);
      });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
      if (mounted) {
        if (user) {
          // Ensure user exists in our database
          try {
            await apiRequest('POST', '/api/users', {
              id: user.uid,
              email: user.email,
              displayName: user.displayName || user.email,
              photoURL: user.photoURL,
            });
            console.log('User created/verified in database');
          } catch (error) {
            // User might already exist, which is fine
            console.log('User creation result:', error);
          }
        }
        setUser(user);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
