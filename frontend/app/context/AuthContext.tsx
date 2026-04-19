import React, { createContext, useContext, ReactNode } from 'react';

interface User {
  email: string;
  name?: string;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Load user from localStorage on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('userName');
    const authToken = localStorage.getItem('authToken');

    if (authToken && savedEmail) {
      setUser({
        email: savedEmail,
        name: savedName || undefined,
      });
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, name?: string) => {
    const newUser: User = { email, name };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('userEmail', email);
    if (name) localStorage.setItem('userName', name);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
