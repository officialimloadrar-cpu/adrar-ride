import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { getT } from '../lib/translations'
import { calcColisInside, calcColisCar, calcColisMoto, calcCargo } from '../lib/pricingEngine'
export default function ClientRequestColis({lang}:{lang:string}){
  const t=getT(lang)
  const [o,setO]=useState('')
  const [d,setD]=useState('')
  const [kg,setKg]=useState(2)
  const [type,setType]=useState<'light'|'cargo'>('light')
  const [ok,setOk]=useState(false)
  const km=12
  const price=type==='light'?calcColisInside(kg,30):(kg<=15?calcColisMoto(km):calcCargo(km))
  const send=async()=>{
    await supabase.from('colis_orders').insert([{origin:o,dest:d,weight:kg,distance:km,price:price,type:type,status:'pending'}])
    setOk(true)
  }
  if(ok) return <div dir={lang==='ar'?'rtl':'ltr'} style={{padding:80,textAlign:'center',fontWeight:900}}>✓ {t.sendParcel}</div>
  return (
    <div dir={lang==='ar'?'rtl':'ltr'} style={{maxWidth:440,margin:'0 auto',padding:'32px 20px'}}>
      <h2 style={{fontSize:30,fontWeight:900}}>{t.parcel} - {type==='light'?t.light:t.cargo}</h2>
      <div style={{display:'flex',gap:8,marginTop:16}}>
        <button onClick={()=>setType('light')} style={{flex:1,padding:12,borderRadius:12,border:'1px solid #e5e7eb',background:type==='light'?'#111':'#fff',color:type==='light'?'#fff':'#111'}}>{t.small} Light &lt;10kg</button>
        <button onClick={()=>setType('cargo')} style={{flex:1,padding:12,borderRadius:12,border:'1px solid #e5e7eb',background:type==='cargo'?'#111':'#fff',color:type==='cargo'?'#fff':'#111'}}>{t.large} Cargo</button>
      </div>
      <div style={{display:'grid',gap:12,marginTop:16}}>
        <input value={o} onChange={e=>setO(e.target.value)} placeholder={t.from} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}/>
        <input value={d} onChange={e=>setD(e.target.value)} placeholder={t.to} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}/>
        <input type="number" value={kg} onChange={e=>setKg(Number(e.target.value))} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}/>
        <div style={{padding:20,borderRadius:16,background:'#111',color:'#fff',display:'flex',justifyContent:'space-between'}}>
          <span style={{opacity:.6}}>{t.total}</span>
          <span style={{fontWeight:800,fontSize:24}}>{t.fmtPrice(price)}</span>
        </div>
        <button onClick={send} style={{padding:16,borderRadius:14,background:'#111',color:'#fff',border:'none',fontWeight:700}}>{t.sendParcel}</button>
      </div>
    </div>
  )
}
