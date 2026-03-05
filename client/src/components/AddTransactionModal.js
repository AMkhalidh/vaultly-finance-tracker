import { useState, useEffect } from 'react';
import axios from 'axios';
const CATS = { expense:['Food','Transport','Housing','Entertainment','Healthcare','Shopping','Education','Other'], income:['Salary','Freelance','Investment','Other'] };
export default function AddTransactionModal({ onClose, onSaved, editData }) {
  const [form, setForm] = useState({ type:'expense', amount:'', category:'Food', description:'', date:new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (editData) setForm({ type:editData.type, amount:editData.amount, category:editData.category, description:editData.description||'', date:new Date(editData.date).toISOString().split('T')[0] }); }, [editData]);
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { editData ? await axios.put(`/api/transactions/${editData._id}`, form) : await axios.post('/api/transactions', form); onSaved(); }
    catch (err) { setError(err.response?.data?.message||'Something went wrong'); } finally { setLoading(false); }
  };
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:20,animation:'fadeIn 0.2s ease both'}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="card" style={{width:'100%',maxWidth:460,padding:32,animation:'fadeUp 0.3s ease both'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <h2 style={{fontSize:18,fontWeight:700}}>{editData?'Edit Transaction':'Add Transaction'}</h2>
          <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:20}}>×</button>
        </div>
        {error&&<div style={{background:'var(--red-dim)',border:'1px solid rgba(255,94,125,0.2)',borderRadius:'var(--radius-sm)',padding:'10px 14px',marginBottom:16,color:'var(--red)',fontSize:13}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:20}}>
            <label className="label">Type</label>
            <div style={{display:'flex',gap:8}}>
              {['expense','income'].map(t=>(
                <button key={t} type="button" onClick={()=>setForm(p=>({...p,type:t,category:CATS[t][0]}))} style={{flex:1,padding:'10px',borderRadius:'var(--radius-sm)',border:'1px solid',borderColor:form.type===t?(t==='income'?'var(--green)':'var(--red)'):'var(--border)',background:form.type===t?(t==='income'?'var(--green-dim)':'var(--red-dim)'):'transparent',color:form.type===t?(t==='income'?'var(--green)':'var(--red)'):'var(--text-secondary)',fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,cursor:'pointer',transition:'all 0.15s ease'}}>{t==='income'?'↑ Income':'↓ Expense'}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:16}}><label className="label">Amount ($)</label><input className="input" type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} required /></div>
          <div style={{marginBottom:16}}><label className="label">Category</label><select className="input" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>{CATS[form.type].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div style={{marginBottom:16}}><label className="label">Description (optional)</label><input className="input" placeholder="e.g. Grocery run..." value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} /></div>
          <div style={{marginBottom:28}}><label className="label">Date</label><input className="input" type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} required /></div>
          <div style={{display:'flex',gap:10}}>
            <button type="button" className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{flex:2,justifyContent:'center'}} disabled={loading}>{loading?'Saving...':editData?'Save Changes':'Add Transaction'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
