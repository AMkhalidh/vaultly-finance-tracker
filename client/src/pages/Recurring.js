import { useState, useEffect } from 'react';
import api from '../api';
const CATS = { expense:['Food','Transport','Housing','Entertainment','Healthcare','Shopping','Education','Other'], income:['Salary','Freelance','Investment','Other'] };
const FREQ_LABELS = { weekly:'Weekly', monthly:'Monthly', yearly:'Yearly' };
export default function Recurring() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ type:'expense', amount:'', category:'Food', description:'', frequency:'monthly', nextDue:new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const fetch_ = async () => { try { setItems((await api.get('/api/recurring')).data); } catch(e) { console.error(e); } };
  useEffect(() => { fetch_(); }, []);
  const openForm = (item=null) => { setEditItem(item); setForm(item ? { type:item.type, amount:item.amount, category:item.category, description:item.description||'', frequency:item.frequency, nextDue:new Date(item.nextDue).toISOString().split('T')[0] } : { type:'expense', amount:'', category:'Food', description:'', frequency:'monthly', nextDue:new Date().toISOString().split('T')[0] }); setShowForm(true); };
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { editItem ? await api.put(`/api/recurring/${editItem._id}`, form) : await api.post('/api/recurring', form); fetch_(); setShowForm(false); }
    catch(err) { console.error(err); } finally { setLoading(false); }
  };
  const del = async (id) => { await api.delete(`/api/recurring/${id}`); fetch_(); };
  const daysUntil = (date) => Math.ceil((new Date(date) - new Date()) / 86400000);
  const totalMonthly = items.reduce((s,i) => { const amt = i.type==='expense'?-i.amount:i.amount; return s + (i.frequency==='weekly'?amt*4.33:i.frequency==='yearly'?amt/12:amt); }, 0);
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,animation:'fadeUp 0.3s ease both'}}>
        <div><h1 style={{fontSize:28,fontWeight:800,letterSpacing:'-0.03em',marginBottom:4}}>Recurring</h1><p style={{color:'var(--text-secondary)',fontSize:14}}>{items.length} recurring transaction{items.length!==1?'s':''}</p></div>
        <button className="btn btn-primary" onClick={()=>openForm()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Add Recurring
        </button>
      </div>
      <div className="card" style={{marginBottom:24,display:'flex',gap:32}}>
        <div><p className="label">Monthly Net Impact</p><p style={{fontSize:24,fontWeight:800,fontFamily:'var(--font-mono)',color:totalMonthly>=0?'var(--green)':'var(--red)'}}>{totalMonthly>=0?'+':''}{totalMonthly.toFixed(2)}</p></div>
        <div><p className="label">Total Items</p><p style={{fontSize:24,fontWeight:800,fontFamily:'var(--font-mono)'}}>{items.length}</p></div>
      </div>
      {items.length===0 ? (
        <div className="card" style={{textAlign:'center',padding:'60px 20px'}}>
          <p style={{fontSize:48,marginBottom:16}}>🔁</p>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>No recurring transactions</h3>
          <p style={{color:'var(--text-secondary)',fontSize:14,marginBottom:24}}>Track bills, subscriptions and regular income.</p>
          <button className="btn btn-primary" onClick={()=>openForm()}>Add your first one</button>
        </div>
      ) : (
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          {items.map((item,i) => {
            const d = daysUntil(item.nextDue);
            return (
              <div key={item._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 24px',borderBottom:i<items.length-1?'1px solid var(--border)':'none'}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:item.type==='income'?'var(--green-dim)':'var(--red-dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{item.type==='income'?'↑':'↓'}</div>
                  <div>
                    <p style={{fontWeight:600,fontSize:14}}>{item.description||item.category}</p>
                    <p style={{fontSize:11,color:'var(--text-muted)'}}>{FREQ_LABELS[item.frequency]} · {item.category} · Due {d===0?'today':d>0?`in ${d} days`:`${Math.abs(d)} days ago`}</p>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontFamily:'var(--font-mono)',fontWeight:700,color:item.type==='income'?'var(--green)':'var(--red)'}}>{item.type==='income'?'+':'-'}${Number(item.amount).toFixed(2)}</span>
                  <button className="btn btn-ghost btn-sm" onClick={()=>openForm(item)} style={{padding:'4px 8px',fontSize:11}}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>del(item._id)} style={{padding:'4px 8px',fontSize:11}}>Del</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:20}} onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="card" style={{width:'100%',maxWidth:460,padding:32}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <h2 style={{fontSize:18,fontWeight:700}}>{editItem?'Edit Recurring':'Add Recurring Transaction'}</h2>
              <button onClick={()=>setShowForm(false)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:20}}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:16}}><label className="label">Type</label><div style={{display:'flex',gap:8}}>{['expense','income'].map(t=><button key={t} type="button" onClick={()=>setForm(p=>({...p,type:t,category:CATS[t][0]}))} style={{flex:1,padding:'10px',borderRadius:8,border:'1px solid',borderColor:form.type===t?(t==='income'?'var(--green)':'var(--red)'):'var(--border)',background:form.type===t?(t==='income'?'var(--green-dim)':'var(--red-dim)'):'transparent',color:form.type===t?(t==='income'?'var(--green)':'var(--red)'):'var(--text-secondary)',fontWeight:600,fontSize:14,cursor:'pointer'}}>{t==='income'?'↑ Income':'↓ Expense'}</button>)}</div></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                <div><label className="label">Amount ($)</label><input className="input" type="number" min="0.01" step="0.01" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} required /></div>
                <div><label className="label">Frequency</label><select className="input" value={form.frequency} onChange={e=>setForm(p=>({...p,frequency:e.target.value}))}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div>
              </div>
              <div style={{marginBottom:16}}><label className="label">Category</label><select className="input" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>{CATS[form.type].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              <div style={{marginBottom:16}}><label className="label">Description (optional)</label><input className="input" placeholder="e.g. Netflix, Rent..." value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} /></div>
              <div style={{marginBottom:24}}><label className="label">Next Due Date</label><input className="input" type="date" value={form.nextDue} onChange={e=>setForm(p=>({...p,nextDue:e.target.value}))} required /></div>
              <div style={{display:'flex',gap:10}}>
                <button type="button" className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={()=>setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{flex:2,justifyContent:'center'}} disabled={loading}>{loading?'Saving...':editItem?'Save Changes':'Add Recurring'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
