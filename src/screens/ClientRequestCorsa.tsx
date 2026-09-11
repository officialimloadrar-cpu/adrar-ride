import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ClientRequestCorsa(){
  const [origin,setOrigin]=useState('أدرار - وسط')
  const [dest,setDest]=useState('تيميمون')
  const [loading,setLoading]=useState(false)
  const [done,setDone]=useState(false)

  const request = async ()=>{
    setLoading(true)
    const { error } = await supabase.from('corsa_orders').insert([{
      origin, dest, distance:146, seats:4, type:'collective', status:'pending'
    }])
    setLoading(false)
    if(!error) setDone(true)
  }

  if(done) return <div style={{padding:'40px 0',fontWeight:700}}>تم إرسال الطلب - في انتظار السائق</div>

  return (
    <div style={{maxWidth:420,padding:'24px 0'}}>
      <h2 style={{fontSize:28,fontWeight:800,letterSpacing:-1,margin:'0 0 24px'}}>Corsa</h2>
      <div style={{display:'grid',gap:12}}>
        <input value={origin} onChange={e=>setOrigin(e.target.value)} style={{padding:'14px 16px',borderRadius:12,border:'1px solid #e5e7eb'}} />
        <input value={dest} onChange={e=>setDest(e.target.value)} style={{padding:'14px 16px',borderRadius:12,border:'1px solid #e5e7eb'}} />
        <div style={{padding:'12px 16px',background:'#f9fafb',borderRadius:12}}>146 km • 4 seats • Collective</div>
        <button onClick={request} disabled={loading} style={{padding:'14px',borderRadius:12,background:'#111',color:'#fff',border:'none',fontWeight:600}}>{loading?'...':'Confirm'}</button>
      </div>
    </div>
  )
}
