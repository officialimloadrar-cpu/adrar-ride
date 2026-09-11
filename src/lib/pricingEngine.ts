export function isNightNow(h = new Date().getHours()){ return h >= 20 || h < 6 }

export function calcInsideGroup(d:number, night:boolean){
  if(d <= 10) return night? 250 : 150
  return (night? 250 : 150) + (night? 30 : 15) * (d - 10)
}

export function calcInsideSolo(d:number, night:boolean){
  if(!night){
    if(d <= 10) return 350
    if(d <= 14) return 350 + 50 * (d - 10)
    return 550 + 30 * (d - 14)
  }else{
    if(d <= 10) return 480
    if(d <= 14) return 480 + 50 * (d - 10)
    return 680 + 30 * (d - 14)
  }
}

export function calcOutsideSeat(dest:string){
  const m:Record<string,number> = { bouda:150, fenoughil:200, zaouiet:600, reggane:1200, timimoun:1700, aoulef:1700, bordj:3500 }
  const k = dest.toLowerCase()
  for(const key in m){ if(k.includes(key)) return m[key] }
  return 0
}

export function calcCargo(d:number){
  return Math.round(d * 53.89)
}

export function calcCargoRetour(d:number){
  return Math.round(d * 53.89 * 0.623)
}

export function calcFourgonInside(){ return 1200 }

export function calcMakla(d:number, night:boolean){
  const base = night? 350 : 250
  if(d <= 5) return base
  return base + 15 * (d - 5)
}

export function calcSouk(pieces:number, d:number){
  let base = 200
  if(pieces >= 1 && pieces <= 5) base = 200
  else if(pieces <= 15) base = 300
  else if(pieces <= 30) base = 400
  else base = 450
  if(d > 5) base += 15 * (d - 5)
  return base
}

export function calcColisInside(weight:number, size:number){
  if(size > 60) return 500
  if(size > 40) return 300
  if(weight < 2) return 250
  if(weight <= 5) return 300
  if(weight <= 10) return 500
  return 500
}

export function calcColisMoto(d:number){
  return Math.max(250, 100 + 15 * d)
}

export function calcColisCar(d:number){
  return 300 + 18 * d
}

export function calcColisH100(d:number){
  return 600 + 20 * d
}

export function calcFourgonShort(d:number){
  return 800 + 21 * d
}

export function calcFourgonLong(d:number){
  return 2000 + 60 * d
}

export function calcCamionSmallShort(d:number){
  return 1500 + 35 * d
}

export function calcCamionSmallLong(d:number){
  return 3000 + 70 * d
}

export function calcCamionLargeShort(d:number){
  return 2000 + 45 * d
}

export function calcCamionLargeLong(d:number){
  return 4000 + 85 * d
}

export function calcDeminage(rooms:number){
  if(rooms === 1) return 1500
  if(rooms === 2) return 3000
  return 5000
}

export function calcRental(type:string, days:number, withDriver:boolean){
  let daily = 7000
  if(type.includes('duster')) daily = 10000
  if(type.includes('hilux')) daily = 12000
  if(type.includes('h100')) daily = 8000
  let total = daily * days
  if(withDriver) total += (type.includes('hilux')? 3000 : 2000) * days
  return total
}

export function calcCommission(price:number, inside:boolean, service:string){
  if(service === 'makla') return price * 0.20
  if(service === 'cargo' || service === 'rental') return price * 0.15
  if(service === 'colis') return price * 0.15
  return price * (inside? 0.1333 : 0.15)
}
