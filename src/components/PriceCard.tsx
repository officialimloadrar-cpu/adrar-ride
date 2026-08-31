
import { PricingBreakdown } from '@/services/pricingEngine'
export default function PriceCard({q}:{q:PricingBreakdown}){
  return <div className="card" style={{padding:18}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{color:'#6b7280'}}>Total</span><span style={{fontSize:28,fontWeight:800}}>{q.total} {q.currency}</span></div>
    <div style={{marginTop:12,display:'grid',gap:6,fontSize:13,color:'#6b7280'}}>
      <div style={{display:'flex',justifyContent:'space-between'}}><span>Base</span><span>{q.base}</span></div>
      <div style={{display:'flex',justifyContent:'space-between'}}><span>Distance {q.distanceKm.toFixed(1)}km x {q.perKm}</span><span>{q.distanceCost}</span></div>
      {q.weightFee>0&&<div style={{display:'flex',justifyContent:'space-between'}}><span>Weight</span><span>{q.weightFee}</span></div>}
      {q.nightFee>0&&<div style={{display:'flex',justifyContent:'space-between'}}><span>Night</span><span>{q.nightFee}</span></div>}
      {q.surgeFee>0&&<div style={{display:'flex',justifyContent:'space-between'}}><span>Surge</span><span>{q.surgeFee}</span></div>}
    </div>
  </div>
}
