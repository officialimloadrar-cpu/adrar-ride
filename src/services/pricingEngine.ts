export type TripMode = 'standard' | 'comfort' | 'parcel' | 'cargo' | 'colis' | 'rental' | 'transport' | 'bouteille-water' | 'fellah' | 'pets'
export type DayPeriod = 'day' | 'night'
export type VehicleType = TripMode
export type RideType = TripMode
export type Seats = 1 | 2 | 3 | 4 | 5 | 6

export interface PricingInput {
  distanceKm: number
  mode: TripMode
  seats?: number
  weightKg?: number
  period?: DayPeriod
  surge?: number
  durationMin?: number
  dim?: number
}

export interface PricingBreakdown {
  distanceKm: number
  base: number
  perKm: number
  distanceCost: number
  seatFactor: number
  weightFee: number
  nightFee: number
  surgeFee: number
  commission: number
  driverEarning: number
  total: number
  currency: string
  p3Day: number
  p3Night: number
  p4Day: number
  p4Night: number
}

const CONFIG = {
  base: { standard: 150, comfort: 250, parcel: 120, cargo: 500, colis: 150, rental: 1000, transport: 150, 'bouteille-water': 50, fellah: 300, pets: 200 } as Record<TripMode, number>,
  perKm: { standard: 35, comfort: 55, parcel: 28, cargo: 60, colis: 25, rental: 0, transport: 35, 'bouteille-water': 15, fellah: 40, pets: 30 } as Record<TripMode, number>,
  perMinute: { standard: 5, comfort: 8, parcel: 3, cargo: 10, colis: 3, rental: 20, transport: 5, 'bouteille-water': 0, fellah: 5, pets: 4 } as Record<TripMode, number>,
  min: { standard: 200, comfort: 350, parcel: 180, cargo: 800, colis: 250, rental: 1000, transport: 200, 'bouteille-water': 100, fellah: 400, pets: 300 } as Record<TripMode, number>,
  commissionRate: { standard: 0.20, comfort: 0.20, parcel: 0.15, cargo: 0.18, colis: 0.15, rental: 0.25, transport: 0.20, 'bouteille-water': 0.10, fellah: 0.15, pets: 0.20 } as Record<TripMode, number>,
  seatMultiplier: 0.18,
  weight: { freeKg: 5, perKg: 18 },
  nightRate: 0.20,
  surgeCap: 2.0,
  rounding: 50,
  currency: 'DZD'
}

function roundPrice(v: number) { return Math.ceil(v / CONFIG.rounding) * CONFIG.rounding }

export function calculateRide(input: PricingInput): PricingBreakdown {
  const mode = (input.mode as TripMode) || 'standard'
  const seats = Math.max(1, Math.min(6, input.seats || 1))
  const distance = Math.max(0.5, input.distanceKm || 0.5)
  const duration = Math.max(0, input.durationMin || 0)
  const base = CONFIG.base[mode]?? CONFIG.base.standard
  const perKm = CONFIG.perKm[mode]?? CONFIG.perKm.standard
  const distanceCost = distance * perKm
  const timeCost = duration * (CONFIG.perMinute[mode]?? 5)
  let subtotal = base + distanceCost + timeCost
  const seatFactor = seats > 1? (seats - 1) * CONFIG.seatMultiplier : 0
  subtotal += subtotal * seatFactor
  const weightFee = Math.max(0, (input.weightKg || 0) - CONFIG.weight.freeKg) * CONFIG.weight.perKg
  subtotal += weightFee
  const nightFee = input.period === 'night'? subtotal * CONFIG.nightRate : 0
  subtotal += nightFee
  const surge = Math.max(1, Math.min(CONFIG.surgeCap, input.surge || 1))
  const surgeFee = surge > 1? subtotal * (surge - 1) : 0
  subtotal += surgeFee
  let total = Math.max(CONFIG.min[mode]?? 200, subtotal)
  total = roundPrice(total)
  const commission = roundPrice(total * (CONFIG.commissionRate[mode]?? 0.2))
  const nightTotal = roundPrice(total * 1.2)
  return {
    distanceKm: distance, base, perKm,
    distanceCost: roundPrice(distanceCost),
    seatFactor, weightFee: roundPrice(weightFee),
    nightFee: roundPrice(nightFee), surgeFee: roundPrice(surgeFee),
    commission, driverEarning: total - commission, total, currency: CONFIG.currency,
    p3Day: total, p3Night: nightTotal, p4Day: total, p4Night: nightTotal
  }
}

export function getPrice(mode: any, distanceKm: number, opts: any = {}): number {
  return calculateRide({ mode: (mode as TripMode) || 'standard', distanceKm, weightKg: opts.weight, seats: opts.seats, period: opts.period, surge: opts.surge, durationMin: opts.durationMin, dim: opts.dim }).total
}

export const calcParcel = (...args: any[]) => { const w = args[0]; const dist = args[2]?? args[1]; return getPrice('parcel', dist, { weight: w }) }
export const calcLight = (...args: any[]) => { const w = args[0]; const dist = args[1]; return getPrice('standard', dist, { weight: w }) }
export const cargoPrice = (d: any, _t?: any) => getPrice('cargo', Number(d))
export const getPriveBreakdown = (input: any) => typeof input === 'number'? calculateRide({ mode: 'standard', distanceKm: input }) : calculateRide(input)
export const getPriceBreakdown = getPriveBreakdown
export const GOLDEN_RATE = 500
export const prixlight = calculateRide
export const calculatePrice = calculateRide
export const calculateRidePrice = (d: number, t: number, s?: number) => calculateRide({ mode: 'standard', distanceKm: d, durationMin: t, surge: s })
export const calculateCargoPrice = (d: number, t?: number) => calculateRide({ mode: 'cargo', distanceKm: d, durationMin: t })
export const calculateColisPrice = (d: number, t?: number) => calculateRide({ mode: 'colis', distanceKm: d, durationMin: t })
export const freezeQuote = (b: PricingBreakdown) => b.total
export const createDebt = async () => null
export type RideInput = PricingInput
export type RideQuote = PricingBreakdown
export function getPricingConfig(mode: TripMode) { return { base: CONFIG.base[mode], perKm: CONFIG.perKm[mode], min: CONFIG.min[mode] } }