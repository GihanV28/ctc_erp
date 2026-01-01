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
            setUser(currentUser);
            // Optionally fetch fresh user data
            try {
              const freshUser = await authApi.getMe();
              setUser(freshUser);
              localStorage.setItem('user', JSON.stringify(freshUser));
            } catch (error) {
              console.error('Failed to fetch fresh user data:', error);
              // Don't clear auth on getMe failure - keep using cached user
              // Only API 401 interceptor should clear auth
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Don't aggressively clear auth data here
        // Let the API interceptor handle 401 responses
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      // Small delay to ensure token is stored and state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authApi.register(data);
      // Redirect to login after successful registration
      router.push('/login');
    } catch (error) {
      throw error;
    }
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
