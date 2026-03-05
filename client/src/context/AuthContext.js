import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/auth/me').then(res => setUser(res.data)).catch(() => { setToken(null); localStorage.removeItem('token'); }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, [token]);
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setToken(res.data.token); setUser(res.data.user);
  };
  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setToken(res.data.token); setUser(res.data.user);
  };
  const logout = () => { localStorage.removeItem('token'); delete axios.defaults.headers.common['Authorization']; setToken(null); setUser(null); };
  const updateBudget = async (budget) => { const res = await axios.put('/api/auth/budget', { monthlyBudget: budget }); setUser(prev => ({ ...prev, monthlyBudget: res.data.monthlyBudget })); };
  return <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateBudget }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
