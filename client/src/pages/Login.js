import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); } finally { setLoading(false); }
  };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-primary)',padding:20}}>
      <div className="card" style={{width:'100%',maxWidth:420,padding:40}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:56,height:56,borderRadius:16,background:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:24}}>◈</div>
          <h1 style={{fontSize:26,fontWeight:800,letterSpacing:'-0.03em',marginBottom:6}}>Vaultly</h1>
          <p style={{color:'var(--text-secondary)',fontSize:14}}>Track every dollar. Grow every month.</p>
        </div>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:4}}>Welcome back</h2>
        <p style={{color:'var(--text-secondary)',fontSize:13,marginBottom:24}}>Sign in to your account</p>
        {error&&<div style={{background:'var(--red-dim)',border:'1px solid rgba(255,94,125,0.2)',borderRadius:8,padding:'10px 14px',marginBottom:16,color:'var(--red)',fontSize:13}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}><label className="label">Email</label><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required /></div>
          <div style={{marginBottom:8}}><label className="label">Password</label><input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required /></div>
          <div style={{textAlign:'right',marginBottom:24}}><a href="/forgot-password" style={{fontSize:12,color:'var(--accent)',textDecoration:'none'}}>Forgot password?</a></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>{loading?'Signing in...':'Sign in'}</button>
        </form>
        <p style={{textAlign:'center',marginTop:20,fontSize:13,color:'var(--text-secondary)'}}>Don't have an account? <a href="/register" style={{color:'var(--accent)',textDecoration:'none',fontWeight:600}}>Create one</a></p>
      </div>
    </div>
  );
}
