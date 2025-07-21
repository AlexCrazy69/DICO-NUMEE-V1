import React, { useState, createContext, useContext } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  login: (username: string, pass: string) => User | null;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const item = window.sessionStorage.getItem('user');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
      return null;
    }
  });

  const login = (username: string, pass: string): User | null => {
    let userData: User | null = null;
    
    const lowerCaseUsername = username.toLowerCase();
    
    // Hardcoded credentials for demo purposes
    if (lowerCaseUsername === 'admin' && pass === 'admin') {
      userData = { username: 'Admin', role: 'admin' };
    } else if (lowerCaseUsername === 'user' && pass === 'user') {
      userData = { username: 'User', role: 'user' };
    }

    if (userData) {
      try {
        window.sessionStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to save user to sessionStorage', error);
      }
      setUser(userData);
    }
    
    return userData;
  };

  const logout = () => {
    try {
      window.sessionStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to remove user from sessionStorage', error);
    }
    setUser(null);
  };

  return React.createElement(UserContext.Provider, { value: { user, login, logout } }, children);
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};