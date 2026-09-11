import { useState } from 'react'
import { supabase } from '../lib/supabase'
export default function ClientRequestCorsa(){
  const [o,setO]=useState('أدرار - وسط'); const [d,setD]=useState('تيميمون'); const [load,setLoad]=useState(false); const [ok,setOk]=useState(false)
  const send=async()=>{ setLoad(true); await supabase.from('corsa_orders').insert([{origin:o,dest:d,distance:146,seats:4,type:'collective',status:'pending'}]); setLoad(false); setOk(true) }
  if(ok) return <div style={{padding:80,textAlign:'center',fontWeight:900,fontSize:22}}>تم إرسال الطلب ✓</div>
  return (<div style={{maxWidth:440,margin:'0 auto',padding:'32px 20px'}}><h2 style={{fontSize:30,fontWeight:900,letterSpacing:-1.5}}>Ride</h2><div style={{display:'grid',gap:12,marginTop:24}}><input value={o} onChange={e=>setO(e.target.value)} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}/><input value={d} onChange={e=>setD(e.target.value)} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}/><div style={{padding:20,borderRadius:16,background:'#111',color:'#fff',display:'flex',justifyContent:'space-between'}}><span style={{opacity:.6}}>Total</span><span style={{fontWeight:800,fontSize:24}}>DZD 700</span></div><button onClick={send} disabled={load} style={{padding:16,borderRadius:14,background:'#111',color:'#fff',border:'none',fontWeight:700}}>{load?'...':'Confirm Ride'}</button></div></div>)
}
