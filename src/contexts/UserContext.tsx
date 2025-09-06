import React, { createContext, useContext, useEffect, useState } from 'react';
import { webhookService, UserData } from '@/services/webhookService';

interface UserContextType {
  userData: UserData | null;
  isLoggedIn: boolean;
  login: (userData: Partial<UserData>) => void;
  logout: () => void;
  updateUserData: (userData: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Load user data from localStorage on mount
    try {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    }
  }, []);

  const login = (newUserData: Partial<UserData>) => {
    const userDataWithTimestamp: UserData = {
      ...newUserData,
      loginTimestamp: new Date().toISOString(),
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    } as UserData;

    setUserData(userDataWithTimestamp);
    setIsLoggedIn(true);
    webhookService.storeUserData(userDataWithTimestamp);
  };

  const logout = () => {
    setUserData(null);
    setIsLoggedIn(false);
    webhookService.clearUserData();
  };

  const updateUserData = (updatedData: Partial<UserData>) => {
    if (userData) {
      const newUserData = { ...userData, ...updatedData };
      setUserData(newUserData);
      webhookService.storeUserData(newUserData);
    }
  };

  const value: UserContextType = {
    userData,
    isLoggedIn,
    login,
    logout,
    updateUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
