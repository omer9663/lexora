import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'staff' | 'admin' | null;

interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, username?: string, password?: string) => Promise<any>;
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

  const login = async (role: UserRole, username?: string, password?: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('lexora_user', JSON.stringify(userData));
        return userData;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
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
