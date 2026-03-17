import { useState, useEffect } from 'react';
import api from '../api';
const EMOJIS = ['🎯','🏠','✈️','🚗','💻','👶','💍','🎓','🏋️','🌴','💰','🎸'];
export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [form, setForm] = useState({ name:'', targetAmount:'', currentAmount:'', deadline:'', emoji:'🎯' });
  const [loading, setLoading] = useState(false);
  const fetchGoals = async () => { try { setGoals((await api.get('/api/goals')).data); } catch(e) { console.error(e); } };
  useEffect(() => { fetchGoals(); }, []);
  const openForm = (goal=null) => { setEditGoal(goal); setForm(goal ? { name:goal.name, targetAmount:goal.targetAmount, currentAmount:goal.currentAmount, deadline:goal.deadline?new Date(goal.deadline).toISOString().split('T')[0]:'', emoji:goal.emoji } : { name:'', targetAmount:'', currentAmount:'', deadline:'', emoji:'🎯' }); setShowForm(true); };
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { editGoal ? await api.put(`/api/goals/${editGoal._id}`, form) : await api.post('/api/goals', form); fetchGoals(); setShowForm(false); }
    catch(err) { console.error(err); } finally { setLoading(false); }
  };
  const del = async (id) => { await api.delete(`/api/goals/${id}`); fetchGoals(); };
  const pct = (g) => Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100);
  const daysLeft = (deadline) => { if (!deadline) return null; const d = Math.ceil((new Date(deadline) - new Date()) / 86400000); return d; };
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,animation:'fadeUp 0.3s ease both'}}>
        <div><h1 style={{fontSize:28,fontWeight:800,letterSpacing:'-0.03em',marginBottom:4}}>Savings Goals</h1><p style={{color:'var(--text-secondary)',fontSize:14}}>{goals.length} active goal{goals.length!==1?'s':''}</p></div>
        <button className="btn btn-primary" onClick={()=>openForm()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>New Goal
        </button>
      </div>
      {goals.length===0 ? (
        <div className="card" style={{textAlign:'center',padding:'60px 20px'}}>
          <p style={{fontSize:48,marginBottom:16}}>🎯</p>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>No savings goals yet</h3>
          <p style={{color:'var(--text-secondary)',fontSize:14,marginBottom:24}}>Set a goal and track your progress towards it.</p>
          <button className="btn btn-primary" onClick={()=>openForm()}>Create your first goal</button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
          {goals.map((g,i) => {
            const p = pct(g); const dl = daysLeft(g.deadline);
            const color = p>=100?'var(--green)':p>=70?'var(--accent)':p>=40?'var(--yellow)':'var(--red)';
            return (
              <div key={g._id} className="card" style={{animation:`fadeUp 0.4s ease ${i*0.05}s both`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:44,height:44,borderRadius:12,background:'var(--bg-secondary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{g.emoji}</div>
                    <div><p style={{fontWeight:700,fontSize:16}}>{g.name}</p>{dl!==null&&<p style={{fontSize:11,color:dl<7?'var(--red)':'var(--text-muted)'}}>{dl>0?`${dl} days left`:dl===0?'Due today':'Overdue'}</p>}</div>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>openForm(g)} style={{padding:'4px 8px',fontSize:11}}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>del(g._id)} style={{padding:'4px 8px',fontSize:11}}>Del</button>
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontFamily:'var(--font-mono)',fontWeight:700,fontSize:18,color}}>${Number(g.currentAmount).toFixed(2)}</span>
                    <span style={{fontFamily:'var(--font-mono)',fontSize:13,color:'var(--text-muted)'}}>${Number(g.targetAmount).toFixed(2)}</span>
                  </div>
                  <div style={{background:'var(--bg-secondary)',borderRadius:100,height:8,overflow:'hidden'}}>
                    <div style={{width:`${p}%`,height:'100%',background:color,borderRadius:100,transition:'width 0.6s ease'}}/>
                  </div>
                  <p style={{fontSize:11,color:'var(--text-muted)',marginTop:4,textAlign:'right'}}>{p}% complete</p>
                </div>
                {p<100&&<p style={{fontSize:12,color:'var(--text-secondary)'}}>Still need: <span style={{fontFamily:'var(--font-mono)',fontWeight:600,color:'var(--text-primary)'}}>${(g.targetAmount-g.currentAmount).toFixed(2)}</span></p>}
                {p>=100&&<p style={{fontSize:12,color:'var(--green)',fontWeight:600}}>🎉 Goal reached!</p>}
              </div>
            );
          })}
        </div>
      )}
      {showForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:20}} onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="card" style={{width:'100%',maxWidth:460,padding:32}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <h2 style={{fontSize:18,fontWeight:700}}>{editGoal?'Edit Goal':'New Savings Goal'}</h2>
              <button onClick={()=>setShowForm(false)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:20}}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:16}}><label className="label">Emoji</label><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{EMOJIS.map(e=><button key={e} type="button" onClick={()=>setForm(p=>({...p,emoji:e}))} style={{width:36,height:36,borderRadius:8,border:'1px solid',borderColor:form.emoji===e?'var(--accent)':'var(--border)',background:form.emoji===e?'var(--accent-dim)':'transparent',fontSize:18,cursor:'pointer'}}>{e}</button>)}</div></div>
              <div style={{marginBottom:16}}><label className="label">Goal Name</label><input className="input" placeholder="e.g. Emergency Fund" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                <div><label className="label">Target Amount ($)</label><input className="input" type="number" min="1" step="0.01" placeholder="5000" value={form.targetAmount} onChange={e=>setForm(p=>({...p,targetAmount:e.target.value}))} required /></div>
                <div><label className="label">Current Amount ($)</label><input className="input" type="number" min="0" step="0.01" placeholder="0" value={form.currentAmount} onChange={e=>setForm(p=>({...p,currentAmount:e.target.value}))} /></div>
              </div>
              <div style={{marginBottom:24}}><label className="label">Deadline (optional)</label><input className="input" type="date" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))} /></div>
              <div style={{display:'flex',gap:10}}>
                <button type="button" className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={()=>setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{flex:2,justifyContent:'center'}} disabled={loading}>{loading?'Saving...':editGoal?'Save Changes':'Create Goal'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
