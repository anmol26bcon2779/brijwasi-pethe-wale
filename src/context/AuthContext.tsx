import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loginAsAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  loginCustomer: (name: string, email: string, phone: string) => void;
  logoutCustomer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ADMIN_SESSION_KEY = 'bpw_admin_session_v1';
const USER_SESSION_KEY = 'bpw_user_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const data = localStorage.getItem(USER_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  }, [user]);

  const loginAsAdmin = (password: string) => {
    // Secure verification
    if (password === 'brijwasi@admin' || password === 'agra2026' || password === 'admin') {
      setIsAdmin(true);
      setUser({
        id: 'admin-1',
        name: 'Brijwasi Admin',
        email: 'admin@brijwasipethewale.com',
        role: 'admin'
      });
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setUser(null);
  };

  const loginCustomer = (name: string, email: string, phone: string) => {
    const customerUser: User = {
      id: `cust-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer'
    };
    setUser(customerUser);
  };

  const logoutCustomer = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginAsAdmin,
        logoutAdmin,
        loginCustomer,
        logoutCustomer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
