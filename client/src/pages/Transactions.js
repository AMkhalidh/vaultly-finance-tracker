import { useState, useEffect } from 'react';
import axios from 'axios';
import AddTransactionModal from '../components/AddTransactionModal';
const CATS=['Food','Transport','Housing','Entertainment','Healthcare','Shopping','Education','Salary','Freelance','Investment','Other'];
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export default function Transactions() {
  const [transactions,setTransactions]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showModal,setShowModal]=useState(false);
  const [editTx,setEditTx]=useState(null);
  const [filters,setFilters]=useState({type:'',category:'',month:new Date().getMonth()+1,year:new Date().getFullYear()});
  const [deleting,setDeleting]=useState(null);
  const fetchT = async () => {
    setLoading(true);
    try { const p={month:filters.month,year:filters.year}; if(filters.type)p.type=filters.type; if(filters.category)p.category=filters.category; setTransactions((await axios.get('/api/transactions',{params:p})).data); }
    catch(e){console.error(e);} finally{setLoading(false);}
  };
  useEffect(()=>{fetchT();},[filters]);
  const del = async(id)=>{ setDeleting(id); try{await axios.delete(`/api/transactions/${id}`);fetchT();}catch(e){console.error(e);}finally{setDeleting(null);} };
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,animation:'fadeUp 0.3s ease both'}}>
        <div><h1 style={{fontSize:28,fontWeight:800,letterSpacing:'-0.03em',marginBottom:4}}>Transactions</h1><p style={{color:'var(--text-secondary)',fontSize:14}}>{transactions.length} transactions found</p></div>
        <button className="btn btn-primary" onClick={()=>{setEditTx(null);setShowModal(true);}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Add Transaction
        </button>
      </div>
      <div className="card" style={{marginBottom:24}}>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <div><label className="label">Month</label><select className="input" style={{width:120}} value={filters.month} onChange={e=>setFilters(p=>({...p,month:e.target.value}))}>{MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select></div>
          <div><label className="label">Year</label><select className="input" style={{width:100}} value={filters.year} onChange={e=>setFilters(p=>({...p,year:e.target.value}))}>{[2023,2024,2025,2026].map(y=><option key={y} value={y}>{y}</option>)}</select></div>
          <div><label className="label">Type</label><select className="input" style={{width:130}} value={filters.type} onChange={e=>setFilters(p=>({...p,type:e.target.value}))}><option value="">All types</option><option value="income">Income</option><option value="expense">Expense</option></select></div>
          <div><label className="label">Category</label><select className="input" style={{width:150}} value={filters.category} onChange={e=>setFilters(p=>({...p,category:e.target.value}))}><option value="">All categories</option>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          {(filters.type||filters.category)&&<div style={{display:'flex',alignItems:'flex-end'}}><button className="btn btn-ghost btn-sm" onClick={()=>setFilters(p=>({...p,type:'',category:''}))}>Clear</button></div>}
        </div>
      </div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 120px 130px 140px 100px',padding:'12px 24px',borderBottom:'1px solid var(--border)',background:'var(--bg-secondary)'}}>
          {['Description','Category','Date','Amount','Actions'].map(h=><p key={h} style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-muted)'}}>{h}</p>)}
        </div>
        {loading?(<div style={{padding:'48px',textAlign:'center',color:'var(--text-muted)'}}>Loading...</div>):transactions.length===0?(<div style={{padding:'48px',textAlign:'center'}}><p style={{fontSize:32,marginBottom:12}}>📭</p><p style={{color:'var(--text-muted)',fontSize:14}}>No transactions for this period</p></div>):transactions.map((tx,i)=>(
          <div key={tx._id} style={{display:'grid',gridTemplateColumns:'1fr 120px 130px 140px 100px',padding:'14px 24px',borderBottom:i<transactions.length-1?'1px solid var(--border)':'none',alignItems:'center',transition:'background 0.15s'}} onMouseEnter={e=>e.currentTarget.style.background='var(--bg-card-hover)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:32,height:32,borderRadius:7,background:tx.type==='income'?'var(--green-dim)':'var(--red-dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{tx.type==='income'?'↑':'↓'}</div><span style={{fontSize:14,fontWeight:500}}>{tx.description||'—'}</span></div>
            <span className={`badge badge-${tx.type==='income'?'income':'expense'}`} style={{fontSize:11}}>{tx.category}</span>
            <span style={{fontSize:13,color:'var(--text-secondary)',fontFamily:'var(--font-mono)'}}>{new Date(tx.date).toLocaleDateString()}</span>
            <span style={{fontFamily:'var(--font-mono)',fontWeight:700,fontSize:15,color:tx.type==='income'?'var(--green)':'var(--red)'}}>{tx.type==='income'?'+':'-'}${tx.amount.toFixed(2)}</span>
            <div style={{display:'flex',gap:6}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>{setEditTx(tx);setShowModal(true);}} style={{padding:'5px 10px',fontSize:12}}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={()=>del(tx._id)} disabled={deleting===tx._id} style={{padding:'5px 10px',fontSize:12}}>{deleting===tx._id?'...':'Del'}</button>
            </div>
          </div>
        ))}
      </div>
      {showModal&&<AddTransactionModal onClose={()=>{setShowModal(false);setEditTx(null);}} onSaved={()=>{setShowModal(false);setEditTx(null);fetchT();}} editData={editTx}/>}
    </div>
  );
}
