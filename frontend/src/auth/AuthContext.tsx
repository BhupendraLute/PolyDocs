import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserProfile {
  userId: string;
  githubId: string;
  username: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) return urlToken;
    return localStorage.getItem('polydocs_token');
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (token) {
      try {
        return jwtDecode<UserProfile>(token);
      } catch (e) {
        console.error('Failed to decode initial token:', e);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      localStorage.setItem('polydocs_token', urlToken);
      setToken(urlToken);
      try {
        setUser(jwtDecode<UserProfile>(urlToken));
      } catch (e) {
        console.error('Failed to decode token from URL:', e);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('polydocs_token', newToken);
    try {
      setUser(jwtDecode<UserProfile>(newToken));
    } catch (e) {
      console.error('Failed to decode token on login:', e);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('polydocs_token');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
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
