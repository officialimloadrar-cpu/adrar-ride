import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ClientRequestCorsa(){
  const [origin,setOrigin]=useState('أدرار - وسط')
  const [dest,setDest]=useState('تيميمون')
  const [loading,setLoading]=useState(false)
  const [done,setDone]=useState(false)
  // الحساب يبقى لداخل فقط - ما نوروهش للزبون
  const distance = 146
  const total = 700

  const request = async ()=>{
    setLoading(true)
    await supabase.from('corsa_orders').insert([{ origin, dest, distance, seats:4, type:'collective', status:'pending' }])
    setLoading(false)
    setDone(true)
  }

  if(done) return <div style={{padding:'80px 0',textAlign:'center',fontSize:20,fontWeight:800}}>تم إرسال الطلب</div>

  return (
    <div style={{maxWidth:420,margin:'0 auto',padding:'24px 16px'}}>
      <h2 style={{fontSize:32,fontWeight:900,letterSpacing:-1.5,margin:'0 0 28px'}}>Ride</h2>
      <div style={{display:'grid',gap:14}}>
        <input value={origin} onChange={e=>setOrigin(e.target.value)} placeholder="من" style={{padding:'16px',borderRadius:14,border:'1px solid #e5e7eb',fontSize:16}} />
        <input value={dest} onChange={e=>setDest(e.target.value)} placeholder="إلى" style={{padding:'16px',borderRadius:14,border:'1px solid #e5e7eb',fontSize:16}} />
        
        <div style={{marginTop:12,padding:'20px',background:'#111',color:'#fff',borderRadius:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{opacity:.6}}>Total</span>
          <span style={{fontSize:28,fontWeight:800}}>DZD {total}</span>
        </div>

        <button onClick={request} disabled={loading} style={{marginTop:8,padding:'16px',borderRadius:14,background:'#111',color:'#fff',border:'none',fontSize:16,fontWeight:700}}>{loading?'...':'Confirm Ride'}</button>
      </div>
    </div>
  )
}
