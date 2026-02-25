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

  const login = async (role: UserRole, email?: string, password?: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('lexora_user', JSON.stringify(userData));
        return userData;
      } else {
        // Fallback for demo purposes if user doesn't exist yet
        // In a real app, you'd show an error
        const mockUser: User = {
          id: role === 'student' ? 'std_1' : role === 'staff' ? 'stf_1' : 'adm_1',
          name: role === 'student' ? 'John Student' : role === 'staff' ? 'Jane Staff' : 'Arthur Admin',
          email: email || (role === 'student' ? 'student@lexora.com' : role === 'staff' ? 'staff@lexora.com' : 'admin@lexora.com'),
          role,
        };
        
        // Auto-register the mock user if login fails (for demo convenience)
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...mockUser, password: password || 'password' })
        });

        setUser(mockUser);
        localStorage.setItem('lexora_user', JSON.stringify(mockUser));
        return mockUser;
      }
    } catch (error) {
      console.error("Login failed:", error);
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
