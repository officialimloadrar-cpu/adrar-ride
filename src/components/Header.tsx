import { getT } from '../lib/translations'
export default function Header({lang,setLang,page,setPage}:{lang:string,setLang:any,page:string,setPage:any}){
  const t = getT(lang)
  const isCustomer = page==='ride'||page==='parcel'||page==='home'
  return (
    <div dir={lang==='ar'?'rtl':'ltr'} style={{height:64,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',borderBottom:'1px solid #f0f0f0',background:'#fff',position:'sticky',top:0,zIndex:10}}>
      <div style={{fontWeight:900,letterSpacing:-1.5,fontSize:22,cursor:'pointer'}} onClick={()=>setPage('home')}>RIDE</div>
      <div style={{display:'flex',gap:8}}>
        <div style={{display:'flex',gap:2,background:'#f5f5f5',padding:3,borderRadius:20}}>
          {['en','fr','ar'].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:'5px 10px',borderRadius:20,border:'none',background:lang===l?'#111':'transparent',color:lang===l?'#fff':'#666',fontSize:12,fontWeight:700}}>{l.toUpperCase()}</button>)}
        </div>
        {isCustomer && <>
          <button onClick={()=>setPage('ride')} style={{padding:'8px 14px',borderRadius:20,border:'none',background:page==='ride'?'#111':'#f5f5f5',fontWeight:600}}>{t.ride}</button>
          <button onClick={()=>setPage('parcel')} style={{padding:'8px 14px',borderRadius:20,border:'none',background:page==='parcel'?'#111':'#f5f5f5',fontWeight:600}}>{t.parcel}</button>
        </>}
      </div>
    </div>
  )
}
