
import { useState } from 'react'
import { getUnpaidTotal, createSettlement, SettlementMethod } from '@/services/driverSettlementService'
export default function Admin(){
  const [driverId,setDriverId]=useState('')
  const [total,setTotal]=useState<number| null>(null)
  const [amount,setAmount]=useState(0)
  const [method,setMethod]=useState<SettlementMethod>('cash')
  return <div className="grid grid-2"><div className="card" style={{padding:20}}><h2>Settlements</h2><input className="input" placeholder="driver_id" value={driverId} onChange={e=>setDriverId(e.target.value)}/><button className="btn" style={{marginTop:12}} onClick={async()=>{ const t=await getUnpaidTotal(driverId); setTotal(t)}}>Check Balance</button>{total!==null&&<div style={{marginTop:12,fontSize:24,fontWeight:800}}>{total} DZD</div>}</div><div className="card" style={{padding:20}}><h3>New Settlement</h3><input className="input" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))}/><div style={{display:'flex',gap:8,marginTop:12}}>{(['cash','bank','mobile'] as SettlementMethod[]).map(m=><button key={m} className={method===m?'btn':'btn btn-ghost'} onClick={()=>setMethod(m)}>{m}</button>)}</div><button className="btn btn-lg" style={{marginTop:12}} onClick={async()=>{ await createSettlement(driverId,amount,method); alert('settled')}}>Settle</button></div></div>
}
