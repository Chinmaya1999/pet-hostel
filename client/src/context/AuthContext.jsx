import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('wl_token');
    if (!token) return setLoading(false);
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('wl_token'))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = ({ token, user }) => {
    localStorage.setItem('wl_token', token);
    setUser(user);
    return user;
  };

  const login = useCallback(async (email, password) => handleAuth((await api.post('/auth/login', { email, password })).data), []);
  const register = useCallback(async (payload) => handleAuth((await api.post('/auth/register', payload)).data), []);
  const logout = useCallback(() => {
    localStorage.removeItem('wl_token');
    setUser(null);
  }, []);
  const updateProfile = useCallback(async (payload) => {
    const { data } = await api.put('/auth/me', payload);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout, updateProfile }), [user, loading, login, register, logout, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
