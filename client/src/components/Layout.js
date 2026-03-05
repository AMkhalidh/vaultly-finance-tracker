import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <aside style={{width:240,background:'var(--bg-secondary)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',position:'fixed',height:'100vh',zIndex:10}}>
        <div style={{padding:'28px 24px 24px',borderBottom:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,background:'var(--accent)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4H9l3-6 3 6h-2v4z"/></svg>
            </div>
            <span style={{fontSize:20,fontWeight:800,letterSpacing:'-0.02em'}}>Vaultly</span>
          </div>
        </div>
        <nav style={{padding:'16px 12px',flex:1}}>
          {[{to:'/dashboard',label:'Dashboard'},{to:'/transactions',label:'Transactions'}].map(({to,label})=>(
            <NavLink key={to} to={to} style={({isActive})=>({display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:'var(--radius-sm)',textDecoration:'none',marginBottom:2,color:isActive?'var(--accent)':'var(--text-secondary)',background:isActive?'var(--accent-dim)':'transparent',fontWeight:isActive?600:400,fontSize:14,transition:'all 0.15s ease'})}>{label}</NavLink>
          ))}
        </nav>
        <div style={{padding:'16px 12px',borderTop:'1px solid var(--border)'}}>
          <div style={{padding:'10px 12px',marginBottom:4}}>
            <p style={{fontSize:13,fontWeight:600,marginBottom:2}}>{user?.name}</p>
            <p style={{fontSize:11,color:'var(--text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</p>
          </div>
          <button onClick={logout} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'transparent',border:'none',borderRadius:'var(--radius-sm)',color:'var(--text-muted)',cursor:'pointer',fontSize:14,width:'100%',fontFamily:'var(--font-display)'}}>Sign out</button>
        </div>
      </aside>
      <main style={{marginLeft:240,flex:1,padding:'40px',minHeight:'100vh',background:'var(--bg-primary)'}}><Outlet /></main>
    </div>
  );
}
