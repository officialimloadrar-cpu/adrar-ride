export default function Header({lang,setLang,page,setPage}:{lang:string,setLang:any,page:string,setPage:any}){
  return (
    <div style={{height:64,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',borderBottom:'1px solid #f0f0f0',position:'sticky',top:0,background:'#fff',zIndex:10}}>
      <div style={{fontWeight:900,letterSpacing:-1.5,fontSize:22,cursor:'pointer'}} onClick={()=>setPage('home')}>RIDE</div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{display:'flex',gap:2,background:'#f5f5f5',padding:3,borderRadius:20}}>
          {['EN','FR','AR'].map(l=><button key={l} onClick={()=>setLang(l.toLowerCase())} style={{padding:'5px 10px',borderRadius:20,border:'none',background:lang===l.toLowerCase()?'#111':'transparent',color:lang===l.toLowerCase()?'#fff':'#666',fontSize:12,fontWeight:700}}>{l}</button>)}
        </div>
        <button onClick={()=>setPage('ride')} style={{padding:'8px 14px',borderRadius:20,border:'none',background:page==='ride'?'#111':'#f5f5f5',color:page==='ride'?'#fff':'#111',fontWeight:600}}>Ride</button>
        <button onClick={()=>setPage('driver')} style={{padding:'8px 14px',borderRadius:20,border:'none',background:page==='driver'?'#111':'#f5f5f5',color:page==='driver'?'#fff':'#111',fontWeight:600}}>Driver</button>
      </div>
    </div>
  )
}
