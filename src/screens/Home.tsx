import { getT } from '../lib/translations'
export default function Home({setPage, lang}:{setPage:any, lang:string}){
  const t=getT(lang)
  const [role,setRole]=useState<string|null>(null)
  if(!role){
    return (
      <div dir={lang==='ar'?'rtl':'ltr'} style={{maxWidth:900,margin:'0 auto',padding:'60px 20px'}}>
        <h1 style={{fontSize:42,fontWeight:900,marginBottom:32}}>{t.whoAreYou}</h1>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <button onClick={()=>setRole('customer')} style={{padding:40,borderRadius:24,border:'1px solid #eee',background:'#111',color:'#fff',fontSize:24,fontWeight:800}}>{t.customer}</button>
          <button onClick={()=>setRole('driver')} style={{padding:40,borderRadius:24,border:'1px solid #eee',background:'#fff',fontSize:24,fontWeight:800}}>{t.driver}</button>
        </div>
      </div>
    )
  }
  if(role==='driver'){
    return (
      <div dir={lang==='ar'?'rtl':'ltr'} style={{maxWidth:900,margin:'0 auto',padding:'40px 20px'}}>
        <button onClick={()=>setRole(null)} style={{marginBottom:20,background:'none',border:'none'}}>←</button>
        <div style={{display:'grid',gap:16}}>
          <button onClick={()=>setPage('driver')} style={{textAlign:'left',padding:28,borderRadius:20,background:'#111',color:'#fff'}}><div style={{fontSize:22,fontWeight:800}}>{t.driver}</div><div style={{opacity:.6,marginTop:6}}>20 سائق جاهز - أدرار</div></button>
        </div>
      </div>
    )
  }
  return (
    <div dir={lang==='ar'?'rtl':'ltr'} style={{maxWidth:900,margin:'0 auto',padding:'40px 20px'}}>
      <button onClick={()=>setRole(null)} style={{marginBottom:20,background:'none',border:'none'}}>←</button>
      <h1 style={{fontSize:42,fontWeight:900,letterSpacing:-2,lineHeight:.9,margin:'0 0 32px'}}>تنقل في أي مكان<br/>في أدرار.</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <button onClick={()=>setPage('ride')} style={{textAlign:'left',padding:24,borderRadius:20,border:'1px solid #eee',background:'#111',color:'#fff'}}><div style={{fontSize:22,fontWeight:800}}>{t.ride}</div><div style={{opacity:.6,marginTop:6}}>{t.chooseDest}</div></button>
        <button onClick={()=>setPage('parcel')} style={{textAlign:'left',padding:24,borderRadius:20,border:'1px solid #eee',background:'#fff'}}><div style={{fontSize:22,fontWeight:800}}>{t.parcel}</div><div style={{opacity:.6,marginTop:6}}>{t.small} / {t.large}</div></button>
        <button onClick={()=>setPage('rental')} style={{textAlign:'left',padding:24,borderRadius:20,border:'1px solid #eee',background:'#fff',gridColumn:'1 / span 2'}}><div style={{fontSize:22,fontWeight:800}}>{t.rental}</div><div style={{opacity:.6,marginTop:6}}>7000 دج / يوم</div></button>
      </div>
    </div>
  )
}
import { useState } from 'react'
