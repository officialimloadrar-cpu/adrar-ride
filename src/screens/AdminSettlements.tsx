import { useState, useEffect } from 'react'
import { getUnpaidTotal, createSettlement, SettlementMethod } from '@/services/driverSettlementService'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '87929879879'
const MASTER_PHONE = import.meta.env.VITE_MASTER_PHONE || '213540499977'

export default function Admin(){
  // --- حماية ---
  const [isAuth, setIsAuth] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  useEffect(()=>{
    if(localStorage.getItem('admin_auth')==='true') setIsAuth(true)
  },[])

  const handleLogin = () => {
    if(pin === ADMIN_PIN || pin === MASTER_PHONE){
      localStorage.setItem('admin_auth','true')
      setIsAuth(true)
    } else {
      setError('الكود خاطئ!')
    }
  }

  // --- كودك القديم ---
  const [driverId,setDriverId]=useState('')
  const [total,setTotal]=useState<number| null>(null)
  const [amount,setAmount]=useState(0)
  const [method,setMethod]=useState<SettlementMethod>('cash')

  if(!isAuth){
    return (
      <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f9fafb',padding:24}}>
        <div style={{background:'#fff',padding:32,borderRadius:16,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',width:'100%',maxWidth:400}}>
          <h2 style={{fontWeight:'bold',textAlign:'center'}}>RIDE Admin</h2>
          <p style={{textAlign:'center',color:'#6b7280',margin:'12px 0 20px'}}>أدخل الكود السري</p>
          <input type="password" placeholder="الكود: 87929879879" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=> e.key==='Enter' && handleLogin()} style={{width:'100%',padding:'12px',border:'1px solid #e5e7eb',borderRadius:12}}/>
          {error && <div style={{color:'red',textAlign:'center',marginTop:8}}>{error}</div>}
          <button onClick={handleLogin} style={{width:'100%',marginTop:12,padding:12,background:'#111827',color:'#fff',borderRadius:12,border:'none',fontWeight:'bold'}}>دخول</button>
        </div>
      </div>
    )
  }

  return <div className="grid grid-2"><div className="card" style={{padding:20}}><h2>Settlements</h2><input className="input" placeholder="driver_id" value={driverId} onChange={e=>setDriverId(e.target.value)}/><button className="btn" style={{marginTop:12}} onClick={async()=>{ const t=await getUnpaidTotal(driverId); setTotal(t)}}>Check Balance</button>{total!==null&&<div style={{marginTop:12,fontSize:24,fontWeight:800}}>{total} DZD</div>}</div><div className="card" style={{padding:20}}><h3>New Settlement</h3><input className="input" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))}/><div style={{display:'flex',gap:8,marginTop:12}}>{(['cash','bank','mobile'] as SettlementMethod[]).map(m=><button key={m} className={method===m?'btn':'btn btn-ghost'} onClick={()=>setMethod(m)}>{m}</button>)}</div><button className="btn btn-lg" style={{marginTop:12}} onClick={async()=>{ await createSettlement(driverId,amount,method); alert('settled')}}>Settle</button><button onClick={()=>{localStorage.removeItem('admin_auth'); setIsAuth(false)}} style={{marginTop:20,color:'#6b7280',background:'none',border:'none',cursor:'pointer'}}>خروج</button></div></div>
}
