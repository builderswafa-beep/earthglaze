'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('earthglaze_token');
      const savedUserStr = localStorage.getItem('earthglaze_user');
      let cachedUser = null;
      if (savedUserStr) {
        try {
          cachedUser = JSON.parse(savedUserStr);
          setUser(cachedUser);
        } catch (e) {}
      }

      if (token) {
        try {
          const res = await api.auth.me();
          if (res && res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('earthglaze_user', JSON.stringify(res.user));
          } else if (!cachedUser) {
            localStorage.removeItem('earthglaze_token');
            setUser(null);
          }
        } catch (err) {
          // Keep cached user if offline or network error
          if (cachedUser) {
            setUser(cachedUser);
          }
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res && res.success && res.token) {
        localStorage.setItem('earthglaze_token', res.token);
        if (res.user) {
          localStorage.setItem('earthglaze_user', JSON.stringify(res.user));
          setUser(res.user);
        }
        return { success: true, user: res.user };
      }

      // Fallback response handling
      return { success: false, message: res?.message || 'Invalid email or password.' };
    } catch (err) {
      return { success: false, message: 'Authentication error. Please try again.' };
    }
  };

  const register = async (name, email, password, phone = '') => {
    try {
      const res = await api.auth.register({ name, email, password, phone });
      if (res.success && res.token) {
        localStorage.setItem('earthglaze_token', res.token);
        if (res.user) {
          localStorage.setItem('earthglaze_user', JSON.stringify(res.user));
          setUser(res.user);
        }
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed.', errors: res.errors };
    } catch (err) {
      return { success: false, message: 'Unable to complete registration. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('earthglaze_token');
      localStorage.removeItem('earthglaze_user');
    }
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.auth.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Update failed.' };
  };

  const refreshUser = async () => {
    const res = await api.auth.me();
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
