import { useState } from 'react'
import { getT } from '../lib/translations'
export default function AdminSettlements({lang}:{lang:string}){
  const t=getT(lang); const [code,setCode]=useState('')
  return (<div dir={lang==='ar'?'rtl':'ltr'} style={{minHeight:'70vh',display:'grid',placeItems:'center'}}><div style={{width:360,padding:32,borderRadius:20,background:'#fff',boxShadow:'0 10px 30px rgba(0,0,0,.08)'}}><h2 style={{fontWeight:900,textAlign:'center'}}>RIDE Admin</h2><p style={{textAlign:'center',opacity:.6}}>{t.enterCode}</p><input type="password" value={code} onChange={e=>setCode(e.target.value)} placeholder={t.enterCode} style={{width:'100%',padding:14,borderRadius:12,border:'1px solid #e5e7eb',marginTop:16}}/><button style={{width:'100%',marginTop:12,padding:14,borderRadius:12,background:'#111',color:'#fff',border:'none',fontWeight:700}}>{t.login}</button></div></div>)
}
