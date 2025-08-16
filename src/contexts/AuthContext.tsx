import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  cargo: string;
  dependencia: string;
  numero: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulated authentication - replace with real implementation
  useEffect(() => {
    const savedUser = localStorage.getItem('sicii_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Auto-login as admin for demo
      const defaultAdmin: User = {
        id: '1',
        name: 'Administrador',
        email: 'admin@sicii.com',
        role: 'admin',
        cargo: 'Administrador del Sistema',
        dependencia: 'Sistemas',
        numero: '1001'
      };
      setUser(defaultAdmin);
      localStorage.setItem('sicii_user', JSON.stringify(defaultAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulated login
    const defaultUser: User = {
      id: '1',
      name: 'Administrador',
      email: email,
      role: 'admin',
      cargo: 'Administrador del Sistema',
      dependencia: 'Sistemas',
      numero: '1001'
    };
    setUser(defaultUser);
    localStorage.setItem('sicii_user', JSON.stringify(defaultUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sicii_user');
  };

  const value = {
    user,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};