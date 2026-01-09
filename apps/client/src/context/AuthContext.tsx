'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, isAuthenticated, getCurrentUser } from '@/lib/auth';
import { User, LoginCredentials, RegisterData } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          if (currentUser) {
            // Validate userType - only client users allowed
            if (currentUser.userType !== 'client') {
              console.warn('Non-client user attempted to access client portal');
              throw new Error('Invalid user type');
            }

            setUser(currentUser);
            // Optionally fetch fresh user data
            try {
              const freshUser = await authApi.getMe();

              // Re-validate fresh user data
              if (freshUser.userType !== 'client') {
                throw new Error('Invalid user type');
              }

              setUser(freshUser);
              localStorage.setItem('user', JSON.stringify(freshUser));
            } catch (error) {
              console.error('Failed to fetch user data:', error);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);

    // Validate userType - only client users can access client portal
    if (response.user.userType !== 'client') {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw new Error('Access denied. This portal is for clients only. Please use the admin portal.');
    }

    setUser(response.user);
    router.push('/dashboard');
  };

  const register = async (data: RegisterData) => {
    await authApi.register(data);
    // Redirect to login after successful registration
    router.push('/login');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
