import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService, getErrorMessage } from '../api/services';
import api from '../api/axios';

const AuthContext = createContext(null);

const TOKEN_KEY = 'studytracker_token';
const USER_KEY = 'studytracker_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  // Validate any stored token against the API on first load so a stale/
  // expired token doesn't leave the UI in a false "logged in" state.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authService.login({ email, password });
      persistSession(data.token, data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const { data } = await authService.register({ name, email, password });
      persistSession(data.token, data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }, []);

  const logout = useCallback(() => {
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((partialUser) => {
    setUser((prev) => {
      const next = { ...prev, ...partialUser };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
