import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (_) {
    return null;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hf_auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        const t = parsed.token || null;
        setToken(t);
        const payload = t ? parseJwt(t) : null;
        setRoles(Array.isArray(payload?.roles) ? payload.roles : []);
        setPermissions(Array.isArray(payload?.permissions) ? payload.permissions : []);
      }
    } catch (_) {}
  }, []);

  // Listen for global unauthorized events to force logout when token expires/invalid
  useEffect(() => {
    const onUnauthorized = () => {
      try {
        logout();
      } catch (_) {}
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('hf:unauthorized', onUnauthorized);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('hf:unauthorized', onUnauthorized);
      }
    };
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
    const parsed = parseJwt(next.token);
    setRoles(Array.isArray(parsed?.roles) ? parsed.roles : []);
    setPermissions(Array.isArray(parsed?.permissions) ? parsed.permissions : []);
    localStorage.setItem('hf_auth', JSON.stringify(next));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRoles([]);
    setPermissions([]);
    localStorage.removeItem('hf_auth');
  };

  const isAuthenticated = !!token;
  const isAdmin = roles.includes('ADMIN');
  const isOwner = roles.includes('OWNER');

  const value = useMemo(() => ({ user, token, roles, permissions, login, logout, isAuthenticated, isAdmin, isOwner }), [user, token, roles, permissions]);

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
