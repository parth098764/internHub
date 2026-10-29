import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { api, getStoredToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'company';
    college?: string;
    course?: string;
    skills?: string[];
    companyName?: string;
    industry?: string;
    description?: string;
  }) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.me();
      setUser(res.user);
    } catch {
      api.auth.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    setUser(res.user);
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'company';
    college?: string;
    course?: string;
    skills?: string[];
    companyName?: string;
    industry?: string;
    description?: string;
  }) => {
    const res = await api.auth.register(payload);
    setUser(res.user);
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
  };

  const quickDemoLogin = async (role: UserRole) => {
    if (role === 'student') {
      await login('alex.student@internhub.edu', 'student123');
    } else if (role === 'company') {
      await login('careers@stripe.demo', 'company123');
    } else if (role === 'admin') {
      await login('admin@internhub.edu', 'admin123');
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
