
export type TripMode = 'standard' | 'comfort' | 'parcel'
export type DayPeriod = 'day' | 'night'
export interface PricingInput{
  distanceKm:number
  mode:TripMode
  seats?:number
  weightKg?:number
  period?:DayPeriod
  surge?:number
}
export interface PricingBreakdown{
  distanceKm:number
  base:number
  perKm:number
  distanceCost:number
  seatFactor:number
  weightFee:number
  nightFee:number
  surgeFee:number
  total:number
  currency:string
}
const CONFIG={
  base:{ standard:150, comfort:250, parcel:120 },
  perKm:{ standard:35, comfort:55, parcel:28 },
  min:{ standard:200, comfort:350, parcel:180 },
  seatMultiplier:0.18,
  weight:{ freeKg:5, perKg:18 },
  nightRate:0.20,
  surgeCap:2.0,
  rounding:50,
  currency:'DZD'
}
function roundPrice(v:number){ return Math.ceil(v/CONFIG.rounding)*CONFIG.rounding }
export function calculateRide(input:PricingInput):PricingBreakdown{
  const mode=input.mode||'standard'
  const seats=Math.max(1,Math.min(6,input.seats||1))
  const distance=Math.max(0.5,input.distanceKm||0.5)
  const base=CONFIG.base[mode]
  const perKm=CONFIG.perKm[mode]
  const distanceCost=distance*perKm
  let subtotal=base+distanceCost
  const seatFactor=seats>1?(seats-1)*CONFIG.seatMultiplier:0
  const seatFee=subtotal*seatFactor
  subtotal+=seatFee
  const free=CONFIG.weight.freeKg
  const w=Math.max(0,(input.weightKg||0)-free)
  const weightFee=w*CONFIG.weight.perKg
  subtotal+=weightFee
  const nightFee=input.period==='night'?subtotal*CONFIG.nightRate:0
  subtotal+=nightFee
  const surge=Math.max(1,Math.min(CONFIG.surgeCap,input.surge||1))
  const surgeFee=surge>1?subtotal*(surge-1):0
  subtotal+=surgeFee
  let total=Math.max(CONFIG.min[mode],subtotal)
  total=roundPrice(total)
  return { distanceKm:distance, base, perKm, distanceCost:roundPrice(distanceCost), seatFactor, weightFee:roundPrice(weightFee), nightFee:roundPrice(nightFee), surgeFee:roundPrice(surgeFee), total, currency:CONFIG.currency }
}
export const prixlight=calculateRide
export const freezeQuote=(b:PricingBreakdown)=>b.total
export const createDebt=async()=>null
export type RideInput=PricingInput
export type RideQuote=PricingBreakdown
export type Seats=1|2|3|4|5|6
export type RideType=TripMode
