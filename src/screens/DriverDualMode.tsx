import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getT } from '../lib/translations'
export default function DriverDualMode({lang}:{lang:string}){
  const t=getT(lang); const [orders,setOrders]=useState<any[]>([])
  useEffect(()=>{ const load=async()=>{ const {data}=await supabase.from('corsa_orders').select('*').eq('status','pending'); if(data) setOrders(data) }; load() },[])
  return (<div dir={lang==='ar'?'rtl':'ltr'} style={{maxWidth:520,margin:'0 auto',padding:'24px 20px'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:24}}><h2 style={{fontSize:28,fontWeight:900}}>{t.driver}</h2><div style={{padding:'6px 12px',borderRadius:20,background:'#111',color:'#fff',fontSize:12}}>{t.online}</div></div><div style={{display:'grid',gap:10}}>{orders.map(o=><div key={o.id} style={{padding:14,border:'1px solid #eee',borderRadius:12,display:'flex',justifyContent:'space-between'}}><div><div style={{fontWeight:700}}>{o.origin} → {o.dest}</div><div style={{fontSize:12,opacity:.6}}>146km • 4 seats</div></div><button style={{padding:'8px 14px',borderRadius:10,background:'#111',color:'#fff',border:'none'}}>{t.accept}</button></div>)}</div></div>)
}
