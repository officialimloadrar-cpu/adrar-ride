export default function Home({setPage}:{setPage:any}){
  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:'40px 20px'}}>
      <h1 style={{fontSize:48,fontWeight:900,letterSpacing:-2.5,lineHeight:.9,margin:'0 0 32px'}}>Go anywhere<br/>in Adrar.</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <button onClick={()=>setPage('ride')} style={{textAlign:'left',padding:24,borderRadius:20,border:'1px solid #eee',background:'#111',color:'#fff'}}><div style={{fontSize:22,fontWeight:800}}>Ride</div><div style={{opacity:.6,marginTop:6}}>Adrar → Timimoun</div></button>
        <button onClick={()=>setPage('parcel')} style={{textAlign:'left',padding:24,borderRadius:20,border:'1px solid #eee',background:'#fff'}}><div style={{fontSize:22,fontWeight:800}}>Colis</div><div style={{opacity:.6,marginTop:6}}>Send package</div></button>
      </div>
    </div>
  )
}
