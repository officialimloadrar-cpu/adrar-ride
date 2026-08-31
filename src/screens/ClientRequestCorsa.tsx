
import { useState, useMemo } from 'react'
import { calculateRide, TripMode, DayPeriod } from '@/services/pricingEngine'
import PriceCard from '@/components/PriceCard'
import { createOrder } from '@/services/orders'
import { haversine } from '@/services/geocoding'
export default function RequestRide(){
  const [mode,setMode]=useState<TripMode>('standard')
  const [distance,setDistance]=useState(5)
  const [seats,setSeats]=useState(1)
  const [weight,setWeight]=useState(0)
  const [period,setPeriod]=useState<DayPeriod>('day')
  const [from,setFrom]=useState({lat:27.87,lng:-0.28})
  const [to,setTo]=useState({lat:27.92,lng:-0.32})
  const autoDist=useMemo(()=>haversine(from,to),[from,to])
  const input={ distanceKm: distance || autoDist, mode, seats, weightKg:weight, period }
  const quote=useMemo(()=>calculateRide(input),[distance,autoDist,mode,seats,weight,period])
  const [loading,setLoading]=useState(false)
  const submit=async()=>{ setLoading(true); try{ await createOrder({ type:'transport', mode, distance_km:quote.distanceKm, seats, price:quote.total, status:'pending', meta:{from,to} }); alert(`Order created ${quote.total} ${quote.currency}`) }catch(e:any){ alert(e.message) }finally{ setLoading(false)} }
  return <div className="grid grid-2">
    <div className="card" style={{padding:20}}>
      <h2 style={{margin:'0 0 16px'}}>Ride Request</h2>
      <div className="grid">
        <div style={{display:'flex',gap:8}}>{(['standard','comfort'] as TripMode[]).map(m=><button key={m} className={mode===m?'btn':'btn btn-ghost'} onClick={()=>setMode(m)}>{m}</button>)}</div>
        <label>Distance km<input className="input" type="number" value={distance} onChange={e=>setDistance(Number(e.target.value))} /></label>
        <div style={{display:'flex',gap:8}}><input className="input" placeholder="from lat" type="number" step="0.0001" value={from.lat} onChange={e=>setFrom({...from,lat:Number(e.target.value)})}/><input className="input" placeholder="from lng" type="number" step="0.0001" value={from.lng} onChange={e=>setFrom({...from,lng:Number(e.target.value)})}/></div>
        <div style={{display:'flex',gap:8}}><input className="input" placeholder="to lat" type="number" step="0.0001" value={to.lat} onChange={e=>setTo({...to,lat:Number(e.target.value)})}/><input className="input" placeholder="to lng" type="number" step="0.0001" value={to.lng} onChange={e=>setTo({...to,lng:Number(e.target.value)})}/></div>
        <div style={{fontSize:12,color:'#6b7280'}}>Auto haversine: {autoDist.toFixed(2)} km</div>
        <label>Seats<input className="input" type="number" min={1} max={6} value={seats} onChange={e=>setSeats(Number(e.target.value))}/></label>
        <label>Weight kg (parcel)<input className="input" type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))}/></label>
        <div style={{display:'flex',gap:8}}><button className={period==='day'?'btn':'btn btn-ghost'} onClick={()=>setPeriod('day')}>Day</button><button className={period==='night'?'btn':'btn btn-ghost'} onClick={()=>setPeriod('night')}>Night +20%</button></div>
        <button className="btn btn-lg" onClick={submit} disabled={loading}>{loading?'Sending...':'Confirm Ride'}</button>
      </div>
    </div>
    <div className="grid"><PriceCard q={quote}/><div className="card" style={{padding:16}}><div className="map">Live Route - {quote.distanceKm.toFixed(1)} km</div></div></div>
  </div>
}
