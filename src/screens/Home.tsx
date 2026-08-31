export default function Home(){
  return (
    <div style={{padding:32}}>
      <h1 style={{fontSize:48,margin:0,letterSpacing:-2}}>RIDE</h1>
      <p style={{color:"#6b7280",fontSize:18,maxWidth:480}}>Universal Ride & Parcel Platform. Distance-based pricing. Works in any city. No hardcoded zones.</p>
      <div style={{display:"flex",gap:12,marginTop:20}}>
        <a href="/request-ride" style={{background:"#111",color:"#fff",padding:"12px 18px",borderRadius:12,fontWeight:700}}>Request Ride</a>
        <a href="/request-parcel" style={{background:"#fff",border:"1px solid #e5e7eb",padding:"12px 18px",borderRadius:12,fontWeight:600}}>Send Parcel</a>
      </div>
    </div>
  )
}
