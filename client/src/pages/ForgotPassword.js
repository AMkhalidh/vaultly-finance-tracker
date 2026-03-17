import { useState } from 'react';
import api from '../api';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/api/password/forgot', { email }); setSent(true); }
    catch (err) { setSent(true); } finally { setLoading(false); }
  };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-primary)',padding:20}}>
      <div className="card" style={{width:'100%',maxWidth:420,padding:40,textAlign:'center'}}>
        <div style={{width:56,height:56,borderRadius:16,background:'var(--accent-dim)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:24}}>🔑</div>
        {sent ? (
          <>
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:8}}>Check your email</h2>
            <p style={{color:'var(--text-secondary)',fontSize:14,marginBottom:24}}>If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your spam folder too.</p>
            <a href="/login" className="btn btn-primary" style={{display:'block',textAlign:'center',textDecoration:'none'}}>Back to Sign in</a>
          </>
        ) : (
          <>
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:8}}>Forgot password?</h2>
            <p style={{color:'var(--text-secondary)',fontSize:14,marginBottom:28}}>Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:16,textAlign:'left'}}><label className="label">Email</label><input className="input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
              <button className="btn btn-primary" type="submit" style={{width:'100%',justifyContent:'center'}} disabled={loading}>{loading?'Sending...':'Send reset link'}</button>
            </form>
            <a href="/login" style={{display:'block',marginTop:16,fontSize:13,color:'var(--text-muted)',textDecoration:'none'}}>← Back to Sign in</a>
          </>
        )}
      </div>
    </div>
  );
}
