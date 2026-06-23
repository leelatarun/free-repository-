import { useState, useEffect } from 'react';
import { adminApi } from '../utils/api';

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    adminApi
      .verify()
      .then(() => setIsAdmin(true))
      .catch(() => {
        localStorage.removeItem('admin_token');
        setIsAdmin(false);
      })
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  }

  return { isAdmin, loading, logout };
}
