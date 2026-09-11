import { useState } from 'react'
import Header from './components/Header'
import Home from './screens/Home'
import ClientRequestCorsa from './screens/ClientRequestCorsa'
import ClientRequestColis from './screens/ClientRequestColis'
import ClientRental from './screens/ClientRental'
import DriverDualMode from './screens/DriverDualMode'
import AdminSettlements from './screens/AdminSettlements'
export default function App(){
  const [lang,setLang]=useState('ar')
  const [page,setPage]=useState('home')
  return (
    <div style={{minHeight:'100vh',background:'#f8f8f8'}}>
      <Header lang={lang} setLang={setLang} page={page} setPage={setPage} />
      {page==='home' && <Home setPage={setPage} lang={lang} />}
      {page==='ride' && <ClientRequestCorsa lang={lang} />}
      {page==='parcel' && <ClientRequestColis lang={lang} />}
      {page==='rental' && <ClientRental lang={lang} />}
      {page==='driver' && <DriverDualMode lang={lang} />}
      {page==='admin' && <AdminSettlements lang={lang} />}
    </div>
  )
}
