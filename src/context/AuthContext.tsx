import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'staff' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('lexora_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole) => {
    const mockUser: User = {
      id: role === 'student' ? 'std_1' : role === 'staff' ? 'stf_1' : 'adm_1',
      name: role === 'student' ? 'John Student' : role === 'staff' ? 'Jane Staff' : 'Arthur Admin',
      email: role === 'student' ? 'student@lexora.com' : role === 'staff' ? 'staff@lexora.com' : 'admin@lexora.com',
      role,
    };
    setUser(mockUser);
    localStorage.setItem('lexora_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lexora_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
