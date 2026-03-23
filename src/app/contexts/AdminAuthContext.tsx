import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  getToken: () => string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function isTokenValid(token: string | null) {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('adminToken');
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'adminToken') setToken(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Auto-refresh token before expiry (10m token, refresh at 8m)
  useEffect(() => {
    if (!token) return;

    const getTokenExpiryTime = () => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload.exp ? payload.exp * 1000 : null;
      } catch {
        return null;
      }
    };

    const expiryTime = getTokenExpiryTime();
    if (!expiryTime) return;

    // Refresh when 2 minutes remain
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    const refreshAfter = timeUntilExpiry - 2 * 60 * 1000; // 2 minutes before expiry

    if (refreshAfter <= 0) {
      // Token expires soon, refresh immediately
      refreshToken();
      return;
    }

    const timer = setTimeout(refreshToken, refreshAfter);
    return () => clearTimeout(timer);
  }, [token]);

  const refreshToken = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.token) {
          localStorage.setItem('adminToken', data.token);
          setToken(data.token);
          console.log('✓ Token refreshed automatically');
        }
      } else {
        console.warn('Token refresh failed');
        logout();
      }
    } catch (e) {
      console.error('Token refresh error:', e);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data?.token) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login failed', e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  const getToken = () => token;

  const isAdminAuthenticated = isTokenValid(token);

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, login, logout, getToken }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
