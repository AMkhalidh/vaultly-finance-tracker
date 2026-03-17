import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { path:'/dashboard', label:'Dashboard', icon:'M3 13l2-2m0 0l7-7 7 7M5 11v9a1 1 0 001 1h3m10-10l2 2m-2-2v9a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path:'/transactions', label:'Transactions', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { path:'/goals', label:'Savings Goals', icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { path:'/recurring', label:'Recurring', icon:'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--bg-primary)'}}>
      <aside style={{width:220,background:'var(--bg-card)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',padding:'24px 0',position:'fixed',top:0,left:0,height:'100vh',zIndex:10}}>
        <div style={{padding:'0 20px 28px'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>◈</div>
            <span style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:20,letterSpacing:'-0.03em'}}>Vaultly</span>
          </div>
        </div>
        <nav style={{flex:1,padding:'0 12px'}}>
          {NAV.map(item => (
            <button key={item.path} onClick={()=>navigate(item.path)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,border:'none',background:location.pathname===item.path?'var(--accent-dim)':'transparent',color:location.pathname===item.path?'var(--accent)':'var(--text-secondary)',fontFamily:'var(--font-display)',fontWeight:600,fontSize:13,cursor:'pointer',marginBottom:4,transition:'all 0.15s ease',textAlign:'left'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{padding:'0 12px 8px'}}>
          <button onClick={()=>setDark(d=>!d)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,border:'none',background:'transparent',color:'var(--text-secondary)',fontFamily:'var(--font-display)',fontWeight:600,fontSize:13,cursor:'pointer',marginBottom:4,transition:'all 0.15s ease'}}>
            <span style={{fontSize:16}}>{dark?'☀️':'🌙'}</span>{dark?'Light Mode':'Dark Mode'}
          </button>
        </div>
        <div style={{padding:'16px 20px',borderTop:'1px solid var(--border)'}}>
          <p style={{fontSize:13,fontWeight:600,marginBottom:2}}>{user?.name}</p>
          <p style={{fontSize:11,color:'var(--text-muted)',marginBottom:12}}>{user?.email}</p>
          <button onClick={logout} style={{background:'none',border:'none',color:'var(--text-muted)',fontSize:12,cursor:'pointer',padding:0,fontFamily:'var(--font-display)'}}>Sign out</button>
        </div>
      </aside>
      <main style={{marginLeft:220,flex:1,padding:'40px 48px',minHeight:'100vh'}}>
        {children}
      </main>
    </div>
  );
}
