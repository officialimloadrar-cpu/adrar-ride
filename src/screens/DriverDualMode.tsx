
import { useEffect,useState } from 'react'
import { listOrders, updateOrderStatus } from '@/services/orders'
export default function Driver(){
  const [orders,setOrders]=useState<any[]>([])
  useEffect(()=>{ listOrders().then(setOrders) },[])
  return <div><h2>Driver Board</h2><div className="grid">{orders.map(o=><div key={o.id} className="card" style={{padding:16,display:'flex',justifyContent:'space-between'}}><div><div style={{fontWeight:700}}>{o.type} - {o.mode||'standard'}</div><div style={{fontSize:13,color:'#6b7280'}}>{o.distance_km} km - {o.price} DZD</div><div className="badge" style={{marginTop:6}}>{o.status}</div></div><div style={{display:'flex',gap:8}}><button className="btn" onClick={async()=>{ await updateOrderStatus(o.id,'accepted'); setOrders(s=>s.map(x=>x.id===o.id?{...x,status:'accepted'}:x))}}>Accept</button><button className="btn btn-ghost" onClick={async()=>{ await updateOrderStatus(o.id,'done'); setOrders(s=>s.map(x=>x.id===o.id?{...x,status:'done'}:x))}}>Done</button></div></div>)}</div></div>
}
