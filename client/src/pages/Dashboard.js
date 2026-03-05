import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import AddTransactionModal from '../components/AddTransactionModal';
const CC = { Food:'#ff5e7d',Transport:'#7c6cfc',Housing:'#2dd4a0',Entertainment:'#f5c842',Healthcare:'#38bdf8',Shopping:'#fb923c',Education:'#a78bfa',Salary:'#2dd4a0',Freelance:'#38bdf8',Investment:'#7c6cfc',Other:'#8888aa' };
const CT = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return <div style={{background:'var(--bg-card)',border:'1px solid var(--border-light)',borderRadius:8,padding:'10px 14px'}}><p style={{fontSize:12,color:'var(--text-muted)',marginBottom:6}}>{label}</p>{payload.map(p=><p key={p.name} style={{fontSize:13,color:p.color,fontFamily:'var(--font-mono)',fontWeight:600}}>{p.name}: ${p.value?.toFixed(2)}</p>)}</div>;
};
export default function Dashboard() {
  const { user, updateBudget } = useAuth();
  const [summary, setSummary] = useState({ income:0,expenses:0,balance:0,categoryBreakdown:{} });
  const [trend, setTrend] = useState([]);
  const [recent, setRecent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const now = new Date();
  const fetchData = async () => {
    try {
      const [s,t,r] = await Promise.all([axios.get(`/api/transactions/summary?month=${now.getMonth()+1}&year=${now.getFullYear()}`),axios.get('/api/transactions/trend'),axios.get(`/api/transactions?month=${now.getMonth()+1}&year=${now.getFullYear()}`)]);
      setSummary(s.data); setTrend(t.data); setRecent(r.data.slice(0,5));
    } catch(e) { console.error(e); }
  };
  useEffect(()=>{ fetchData(); },[]);
  const bp = user?.monthlyBudget ? Math.min((summary.expenses/user.monthlyBudget)*100,100) : 0;
  const bc = bp>90?'var(--red)':bp>70?'var(--yellow)':'var(--green)';
  const pd = Object.entries(summary.categoryBreakdown).map(([name,value])=>({name,value}));
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:36}}>
        <div style={{animation:'fadeUp 0.3s ease both'}}>
          <h1 style={{fontSize:28,fontWeight:800,letterSpacing:'-0.03em',marginBottom:4}}>Good {now.getHours()<12?'morning':now.getHours()<18?'afternoon':'evening'}, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{color:'var(--text-secondary)',fontSize:14}}>{now.toLocaleString('default',{month:'long',year:'numeric'})} overview</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Add Transaction
        </button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[{label:'Total Balance',value:`$${summary.balance.toFixed(2)}`,color:summary.balance>=0?'var(--green)':'var(--red)'},{label:'Income',value:`$${summary.income.toFixed(2)}`,color:'var(--green)',sub:'This month'},{label:'Expenses',value:`$${summary.expenses.toFixed(2)}`,color:'var(--red)',sub:'This month'},{label:'Savings Rate',value:summary.income>0?`${Math.round(((summary.income-summary.expenses)/summary.income)*100)}%`:'—',sub:'Income saved'}].map((c,i)=>(
          <div key={c.label} className="card" style={{animation:`fadeUp 0.4s ease ${i*0.05}s both`}}>
            <p className="label">{c.label}</p>
            <p style={{fontSize:28,fontWeight:800,color:c.color||'var(--text-primary)',fontFamily:'var(--font-mono)',letterSpacing:'-0.02em',marginBottom:4}}>{c.value}</p>
            {c.sub&&<p style={{fontSize:12,color:'var(--text-muted)'}}>{c.sub}</p>}
          </div>
        ))}
      </div>
      {(user?.monthlyBudget>0||editingBudget)&&(
        <div className="card" style={{marginBottom:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div><p className="label">Monthly Budget</p><p style={{fontSize:13,color:'var(--text-secondary)'}}><span style={{color:bc,fontFamily:'var(--font-mono)',fontWeight:600}}>${summary.expenses.toFixed(0)}</span> of <span style={{fontFamily:'var(--font-mono)'}}>${user?.monthlyBudget?.toFixed(0)}</span> spent</p></div>
            <button className="btn btn-ghost btn-sm" onClick={()=>{setBudgetInput(user?.monthlyBudget||'');setEditingBudget(true);}}>Edit</button>
          </div>
          {editingBudget?(<div style={{display:'flex',gap:8}}><input className="input" type="number" placeholder="Monthly budget" value={budgetInput} onChange={e=>setBudgetInput(e.target.value)} style={{maxWidth:200}}/><button className="btn btn-primary btn-sm" onClick={async()=>{await updateBudget(parseFloat(budgetInput)||0);setEditingBudget(false);}}>Save</button><button className="btn btn-ghost btn-sm" onClick={()=>setEditingBudget(false)}>Cancel</button></div>):(<div style={{background:'var(--bg-secondary)',borderRadius:100,height:8,overflow:'hidden'}}><div style={{width:`${bp}%`,height:'100%',background:bc,borderRadius:100,transition:'width 0.6s ease'}}/></div>)}
        </div>
      )}
      {!user?.monthlyBudget&&!editingBudget&&<button className="btn btn-ghost" style={{marginBottom:24,fontSize:13}} onClick={()=>setEditingBudget(true)}>+ Set monthly budget</button>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:16,marginBottom:24}}>
        <div className="card">
          <p className="label" style={{marginBottom:16}}>6-Month Trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2dd4a0" stopOpacity={0.15}/><stop offset="95%" stopColor="#2dd4a0" stopOpacity={0}/></linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff5e7d" stopOpacity={0.15}/><stop offset="95%" stopColor="#ff5e7d" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)',fontSize:12}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)',fontSize:11,fontFamily:'var(--font-mono)'}} tickFormatter={v=>`$${v}`}/>
              <Tooltip content={<CT/>}/>
              <Area type="monotone" dataKey="income" name="Income" stroke="#2dd4a0" strokeWidth={2} fill="url(#inc)"/>
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ff5e7d" strokeWidth={2} fill="url(#exp)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <p className="label" style={{marginBottom:16}}>Spending by Category</p>
          {pd.length>0?(<><ResponsiveContainer width="100%" height={160}><PieChart><Pie data={pd} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>{pd.map(e=><Cell key={e.name} fill={CC[e.name]||'#8888aa'}/>)}</Pie><Tooltip formatter={v=>`$${v.toFixed(2)}`} contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border-light)',borderRadius:8,fontSize:12}}/></PieChart></ResponsiveContainer><div style={{display:'flex',flexWrap:'wrap',gap:'6px 12px',marginTop:8}}>{pd.slice(0,6).map(({name})=>(<div key={name} style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:8,height:8,borderRadius:2,background:CC[name]||'#8888aa'}}/><span style={{fontSize:11,color:'var(--text-secondary)'}}>{name}</span></div>))}</div></>):(<div style={{height:160,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:13}}>No expense data yet</div>)}
        </div>
      </div>
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <p className="label" style={{margin:0}}>Recent Transactions</p>
          <a href="/transactions" style={{fontSize:12,color:'var(--accent)',textDecoration:'none',fontWeight:600}}>View all →</a>
        </div>
        {recent.length===0?(<p style={{color:'var(--text-muted)',fontSize:13,textAlign:'center',padding:'20px 0'}}>No transactions yet. Add one to get started.</p>):recent.map((tx,i)=>(
          <div key={tx._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:i<recent.length-1?'1px solid var(--border)':'none'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:36,height:36,borderRadius:8,background:tx.type==='income'?'var(--green-dim)':'var(--red-dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{tx.type==='income'?'↑':'↓'}</div>
              <div><p style={{fontSize:14,fontWeight:600}}>{tx.description||tx.category}</p><p style={{fontSize:11,color:'var(--text-muted)'}}>{tx.category} · {new Date(tx.date).toLocaleDateString()}</p></div>
            </div>
            <span style={{fontFamily:'var(--font-mono)',fontWeight:700,fontSize:15,color:tx.type==='income'?'var(--green)':'var(--red)'}}>{tx.type==='income'?'+':'-'}${tx.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
      {showModal&&<AddTransactionModal onClose={()=>setShowModal(false)} onSaved={()=>{setShowModal(false);fetchData();}}/>}
    </div>
  );
}
