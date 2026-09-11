import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { getT } from '../lib/translations'
import { calcInsideGroup, calcInsideSolo, calcOutsideSeat, calcCargo, isNightNow } from '../lib/pricingEngine'
export default function ClientRequestCorsa({lang}:{lang:string}){
  const t=getT(lang)
  const [o,setO]=useState('أدرار - وسط')
  const [d,setD]=useState('تيميمون')
  const [km,setKm]=useState(12)
  const [group,setGroup]=useState(false)
  const [ok,setOk]=useState(false)
  const night=isNightNow()
  const outside=calcOutsideSeat(d)
  const price=outside>0?outside:(km<=20?(group?calcInsideGroup(km,night):calcInsideSolo(km,night)):calcCargo(km))
  const send=async()=>{
    await supabase.from('corsa_orders').insert([{origin:o,dest:d,distance:km,seats:group?4:1,type:group?'collective':'solo',price:price,status:'pending'}])
    setOk(true)
  }
  if(ok) return <div dir={lang==='ar'?'rtl':'ltr'} style={{padding:80,textAlign:'center',fontWeight:900}}>✓ {t.confirmRide}</div>
  return (
    <div dir={lang==='ar'?'rtl':'ltr'} style={{maxWidth:440,margin:'0 auto',padding:'32px 20px'}}>
      <h2 style={{fontSize:30,fontWeight:900}}>{t.ride}</h2>
      <div style={{display:'grid',gap:12,marginTop:24}}>
        <input value={o} onChange={e=>setO(e.target.value)} placeholder={t.from} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}/>
        <input value={d} onChange={e=>setD(e.target.value)} placeholder={t.to} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}/>
        <div style={{display:'flex',gap:8}}>
          <input type="number" value={km} onChange={e=>setKm(Number(e.target.value))} style={{flex:1,padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}/>
          <button onClick={()=>setGroup(!group)} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb',background:group?'#111':'#fff',color:group?'#fff':'#111'}}>{group?'جماعة':'وحدو'}</button>
        </div>
        <div style={{padding:20,borderRadius:16,background:'#111',color:'#fff',display:'flex',justifyContent:'space-between'}}>
          <span style={{opacity:.6}}>{t.total}</span>
          <span style={{fontWeight:800,fontSize:24}}>{t.fmtPrice(price)}</span>
        </div>
        <button onClick={send} style={{padding:16,borderRadius:14,background:'#111',color:'#fff',border:'none',fontWeight:700}}>{t.confirmRide}</button>
      </div>
    </div>
  )
}
