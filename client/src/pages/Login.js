import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); setError(''); setLoading(true); try { await login(form.email, form.password); } catch (err) { setError(err.response?.data?.message||'Login failed'); } finally { setLoading(false); } };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-primary)',padding:20}}>
      <div style={{position:'fixed',top:'20%',left:'50%',transform:'translateX(-50%)',width:600,height:600,background:'radial-gradient(circle,rgba(124,108,252,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{width:'100%',maxWidth:420,animation:'fadeUp 0.5s ease forwards'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{width:52,height:52,background:'var(--accent)',borderRadius:14,display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4H9l3-6 3 6h-2v4z"/></svg>
          </div>
          <h1 style={{fontSize:32,fontWeight:800,letterSpacing:'-0.03em'}}>Vaultly</h1>
          <p style={{color:'var(--text-secondary)',marginTop:6,fontSize:14}}>Track every dollar. Grow every month.</p>
        </div>
        <div className="card" style={{padding:32}}>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:4}}>Welcome back</h2>
          <p style={{color:'var(--text-secondary)',fontSize:13,marginBottom:28}}>Sign in to your account</p>
          {error&&<div style={{background:'var(--red-dim)',border:'1px solid rgba(255,94,125,0.2)',borderRadius:'var(--radius-sm)',padding:'12px 16px',marginBottom:20,color:'var(--red)',fontSize:13}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:16}}><label className="label">Email</label><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required /></div>
            <div style={{marginBottom:24}}><label className="label">Password</label><input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required /></div>
            <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'13px',fontSize:15}} disabled={loading}>{loading?'Signing in...':'Sign in'}</button>
          </form>
          <p style={{textAlign:'center',marginTop:20,fontSize:13,color:'var(--text-secondary)'}}>Don't have an account? <Link to="/register" style={{color:'var(--accent)',textDecoration:'none',fontWeight:600}}>Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
