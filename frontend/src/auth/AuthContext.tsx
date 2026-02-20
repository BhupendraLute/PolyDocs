import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    // Check URL synchronously before first render
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) return urlToken;
    return localStorage.getItem('polydocs_token');
  });

  useEffect(() => {
    // Check URL for token after OAuth redirect (to run side effects)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      localStorage.setItem('polydocs_token', urlToken);
      // Clean up URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('polydocs_token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('polydocs_token');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
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
