export default function Home({setPage, lang}:{setPage:any, lang:string}){
  return (
    <div dir={lang==='ar'?'rtl':'ltr'} style={{maxWidth:900,margin:'0 auto',padding:'40px 20px'}}>
      <h1 style={{fontSize:48,fontWeight:900,letterSpacing:-2.5,lineHeight:.9,margin:'0 0 32px'}}>{lang==='ar'?'تنقل في أي مكان\nفي أدرار.':'Go anywhere\nin Adrar.'}</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <button onClick={()=>setPage('ride')} style={{textAlign:'left',padding:24,borderRadius:20,border:'1px solid #eee',background:'#111',color:'#fff'}}><div style={{fontSize:22,fontWeight:800}}>{lang==='ar'?'توصيلة':lang==='fr'?'Course':'Ride'}</div><div style={{opacity:.6,marginTop:6}}>Adrar → Timimoun</div></button>
        <button onClick={()=>setPage('parcel')} style={{textAlign:'left',padding:24,borderRadius:20,border:'1px solid #eee',background:'#fff'}}><div style={{fontSize:22,fontWeight:800}}>{lang==='ar'?'طرد':lang==='fr'?'Colis':'Parcel'}</div><div style={{opacity:.6,marginTop:6}}>{lang==='ar'?'إرسال طرد':'Send package'}</div></button>
      </div>
    </div>
  )
}
