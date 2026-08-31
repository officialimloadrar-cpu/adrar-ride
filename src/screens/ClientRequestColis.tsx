
import { useState, useMemo } from 'react'
import { calculateRide } from '@/services/pricingEngine'
import PriceCard from '@/components/PriceCard'
import { createOrder } from '@/services/orders'
export default function RequestParcel(){
  const [dist,setDist]=useState(8)
  const [weight,setWeight]=useState(6)
  const quote=useMemo(()=>calculateRide({ distanceKm:dist, mode:'parcel', weightKg:weight }),[dist,weight])
  const send=async()=>{ try{ await createOrder({ type:'colis', mode:'parcel', distance_km:dist, weight_kg:weight, price:quote.total, status:'pending' }); alert(`Parcel ${quote.total} ${quote.currency}`)}catch(e:any){ alert(e.message) } }
  return <div className="grid grid-2"><div className="card" style={{padding:20}}><h2>Parcel</h2><label>Distance km<input className="input" type="number" value={dist} onChange={e=>setDist(Number(e.target.value))}/></label><label>Weight kg<input className="input" type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))}/></label><button className="btn btn-lg" style={{marginTop:12}} onClick={send}>Send Parcel</button></div><PriceCard q={quote}/></div>
}
