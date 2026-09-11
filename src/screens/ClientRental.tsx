import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { getT } from '../lib/translations'
import { calcRental } from '../lib/pricingEngine'
export default function ClientRental({lang}:{lang:string}){
  const t=getT(lang)
  const [type,setType]=useState('clio')
  const [days,setDays]=useState(1)
  const [driver,setDriver]=useState(false)
  const [ok,setOk]=useState(false)
  const price=calcRental(type,days,driver)
  const send=async()=>{
    await supabase.from('rental_orders').insert([{car_type:type,days:days,with_driver:driver,total_price:price,status:'pending'}])
    setOk(true)
  }
  if(ok) return <div dir={lang==='ar'?'rtl':'ltr'} style={{padding:80,textAlign:'center',fontWeight:900}}>✓ {t.confirmRental}</div>
  return (
    <div dir={lang==='ar'?'rtl':'ltr'} style={{maxWidth:440,margin:'0 auto',padding:'32px 20px'}}>
      <h2 style={{fontSize:30,fontWeight:900}}>{t.rental}</h2>
      <div style={{display:'grid',gap:12,marginTop:24}}>
        <select value={type} onChange={e=>setType(e.target.value)} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}>
          <option value="clio">Clio / Symbol - 7000 دج/يوم</option>
          <option value="duster">Duster - 10000 دج/يوم</option>
          <option value="hilux">Hilux - 12000 دج/يوم</option>
          <option value="h100">H100 - 8000 دج/يوم</option>
        </select>
        <input type="number" value={days} onChange={e=>setDays(Number(e.target.value))} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb'}}/>
        <button onClick={()=>setDriver(!driver)} style={{padding:16,borderRadius:14,border:'1px solid #e5e7eb',background:driver?'#111':'#fff',color:driver?'#fff':'#111'}}>{driver?'مع سائق':'بدون سائق'}</button>
        <div style={{padding:20,borderRadius:16,background:'#111',color:'#fff',display:'flex',justifyContent:'space-between'}}>
          <span style={{opacity:.6}}>{t.total}</span>
          <span style={{fontWeight:800,fontSize:24}}>{t.fmtPrice(price)}</span>
        </div>
        <button onClick={send} style={{padding:16,borderRadius:14,background:'#111',color:'#fff',border:'none',fontWeight:700}}>{t.confirmRental}</button>
      </div>
    </div>
  )
}
