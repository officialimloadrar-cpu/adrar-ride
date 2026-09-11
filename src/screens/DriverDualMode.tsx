import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DriverDualMode(){
  const [online,setOnline]=useState(true)
  const [orders,setOrders]=useState<any[]>([])

  useEffect(()=>{
    const load = async ()=>{
      const { data } = await supabase.from('corsa_orders').select('*').eq('status','pending').order('created_at',{ascending:false})
      if(data) setOrders(data)
    }
    load()
    const ch = supabase.channel('corsa_orders').on('postgres_changes',{event:'*',schema:'public',table:'corsa_orders'},load).subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[])

  const accept = async (id:string)=>{
    await supabase.from('corsa_orders').update({status:'accepted'}).eq('id',id)
  }

  return (
    <div style={{maxWidth:520,padding:'24px 0'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h2 style={{fontSize:28,fontWeight:800,letterSpacing:-1,margin:0}}>Driver</h2>
        <button onClick={()=>setOnline(!online)} style={{padding:'8px 16px',borderRadius:20,border:'none',background:online?'#111':'#e5e7eb',color:online?'#fff':'#111',fontWeight:600}}>{online?'Online':'Offline'}</button>
      </div>
      <div style={{display:'grid',gap:10}}>
        {orders.length===0 && <div style={{padding:16,background:'#f9fafb',borderRadius:12,color:'#6b7280'}}>No pending requests</div>}
        {orders.map(o=>(
          <div key={o.id} style={{padding:'14px 16px',border:'1px solid #e5e7eb',borderRadius:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><div style={{fontWeight:700}}>{o.origin} → {o.dest}</div><div style={{fontSize:13,color:'#6b7280'}}>{o.distance}km • {o.seats} seats</div></div>
            <button onClick={()=>accept(o.id)} style={{padding:'8px 14px',borderRadius:10,background:'#111',color:'#fff',border:'none',fontWeight:600}}>Accept</button>
          </div>
        ))}
      </div>
    </div>
  )
}
