export const NIGHT_MULTIPLIER = 1.25
export const NIGHT_START = 21
export const NIGHT_END = 5

export const BASE_PRICING = {
  group: { price: 228, commission: 34 },
  prive: { price: 400, commission: 60 },
  colis: { price: 250, commission: 35 },
  cargo: { price: 1200, commission: 180 },
  rental: { price: 3500, commission: 400 },
  makla: { price: 150, commission: 25 }
}

export const getIsNight = () => {
  const h = new Date().getHours()
  return h >= NIGHT_START || h < NIGHT_END
}

export const getPricing = (type: keyof typeof BASE_PRICING, isNight: boolean) => {
  const base = BASE_PRICING[type]
  const isCorsa = type === 'group' || type === 'prive'
  if (!isCorsa) return base
  if (!isNight) return base
  return {
    price: Math.round(base.price * NIGHT_MULTIPLIER),
    commission: Math.round(base.commission * NIGHT_MULTIPLIER)
  }
}