import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hf_auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      }
    } catch (_) {}
  }, []);

  const login = (payload) => {
    const next = { user: {
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email
    }, token: payload.token };
    setUser(next.user);
    setToken(next.token);
    localStorage.setItem('hf_auth', JSON.stringify(next));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hf_auth');
  };

  const value = useMemo(() => ({ user, token, login, logout, isAuthenticated: !!token }), [user, token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx;
};