import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './screens/Home'
import RequestRide from './screens/ClientRequestCorsa'
import RequestParcel from './screens/ClientRequestColis'
import Driver from './screens/DriverDualMode'
import Admin from './screens/AdminSettlements'
function Nav(){
  const loc=useLocation()
  const is=(p:string)=>loc.pathname===p
  return <header style={{position:"sticky",top:0,zIndex:10,background:"rgba(255,255,255,.85)",backdropFilter:"blur(12px)",borderBottom:"1px solid #e5e7eb"}}>
    <div style={{maxWidth:1120,margin:"0 auto",padding:"0 20px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <Link to="/" style={{fontWeight:800,fontSize:20}}>RIDE</Link>
      <nav style={{display:"flex",gap:8}}>
        <Link style={{padding:"8px 14px",borderRadius:10,background:is('/request-ride')?"#111":"#fff",color:is('/request-ride')?"#fff":"#111",border:"1px solid #e5e7eb"}} to="/request-ride">Ride</Link>
        <Link style={{padding:"8px 14px",borderRadius:10,background:is('/request-parcel')?"#111":"#fff",color:is('/request-parcel')?"#fff":"#111",border:"1px solid #e5e7eb"}} to="/request-parcel">Parcel</Link>
        <Link style={{padding:"8px 14px",borderRadius:10,background:is('/driver')?"#111":"#fff",color:is('/driver')?"#fff":"#111",border:"1px solid #e5e7eb"}} to="/driver">Driver</Link>
        <Link style={{padding:"8px 14px",borderRadius:10,background:is('/admin')?"#111":"#fff",color:is('/admin')?"#fff":"#111",border:"1px solid #e5e7eb"}} to="/admin">Admin</Link>
      </nav>
    </div>
  </header>
}
export default function App(){
  return <BrowserRouter><Nav/><main style={{maxWidth:1120,margin:"0 auto",padding:"24px 20px 64px"}}><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/request-ride" element={<RequestRide/>}/>
    <Route path="/request-parcel" element={<RequestParcel/>}/>
    <Route path="/driver" element={<Driver/>}/>
    <Route path="/admin" element={<Admin/>}/>
  </Routes></main></BrowserRouter>
}
