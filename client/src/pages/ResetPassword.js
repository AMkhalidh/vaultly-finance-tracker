import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');
  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try { await api.post('/api/password/reset', { token, password }); setDone(true); setTimeout(() => navigate('/login'), 3000); }
    catch (err) { setError(err.response?.data?.message || 'Invalid or expired link.'); } finally { setLoading(false); }
  };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-primary)',padding:20}}>
      <div className="card" style={{width:'100%',maxWidth:420,padding:40,textAlign:'center'}}>
        <div style={{width:56,height:56,borderRadius:16,background:'var(--accent-dim)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:24}}>🔒</div>
        {done ? (
          <>
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:8}}>Password reset!</h2>
            <p style={{color:'var(--text-secondary)',fontSize:14}}>Redirecting you to sign in...</p>
          </>
        ) : (
          <>
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:8}}>Set new password</h2>
            <p style={{color:'var(--text-secondary)',fontSize:14,marginBottom:28}}>Choose a strong password for your account.</p>
            {error && <div style={{background:'var(--red-dim)',border:'1px solid rgba(255,94,125,0.2)',borderRadius:8,padding:'10px 14px',marginBottom:16,color:'var(--red)',fontSize:13}}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:16,textAlign:'left'}}><label className="label">New Password</label><input className="input" type="password" placeholder="Min. 6 characters" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
              <div style={{marginBottom:24,textAlign:'left'}}><label className="label">Confirm Password</label><input className="input" type="password" placeholder="Repeat password" value={confirm} onChange={e=>setConfirm(e.target.value)} required /></div>
              <button className="btn btn-primary" type="submit" style={{width:'100%',justifyContent:'center'}} disabled={loading}>{loading?'Resetting...':'Reset password'}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
