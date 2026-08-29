export type Category = 'small' | 'medium' | 'large';
export type Zone = 'city' | 'wilaya' | 'remote';
export type LightVehicle = 'moto' | 'car';
export type FleetType = 'h100' | 'fourgon_short' | 'fourgon_long' | 'truck_small_short' | 'truck_small_long' | 'truck_large_short' | 'truck_large_long' | 'semi';

type Price = { total: number; commission: number; net: number };

const DEBT_LIMIT = 2000;

const COMMISSION = {
  light: 0.15,
  cargoInside: 0.15,
  cargoOutside: 0.13,
  fleet: 0.13,
  fellah: 0.15,
} as const;

const PRICING = {
  city: { small: 250, medium: 300, large: 500 },
  wilaya: { small: 400, medium: 500, large: 700 },
  remote: { small: 800, medium: 1000, large: 1300 },
  hilux: { fixed: 1000, perKm: 53.89 },
  bouteille: { inside: 400, outside: 800 },
  demenagement: { light: 1500, full: 3000, full3: 5000, floor: 500, worker: 500, dismantle: 1000 },
  voyage: { small: 3000, large: 5300 },
  overweight: 50,
} as const;

export const getCategory = (w: number, d: number): Category => {
  if (d > 60) return 'large';
  if (d > 40) return 'medium';
  return w < 2? 'small' : w <= 5? 'medium' : 'large';
};

export const getZone = (km: number): Zone => (km <= 10? 'city' : km <= 150? 'wilaya' : 'remote');

export const motoPrice = (km: number) => (km > 15? null : Math.max(250, 100 + 15 * km));
export const carPrice = (km: number) => 300 + 18 * km;
export const hiluxPrice = (km: number) => Math.round(km * PRICING.hilux.perKm);

export const fleetBasePrice = (km: number, t: FleetType) => {
  switch (t) {
    case 'h100': return 600 + 20 * km;
    case 'fourgon_short': return 800 + 21 * km;
    case 'fourgon_long': return 2000 + 60 * km;
    case 'truck_small_short': return 1500 + 35 * km;
    case 'truck_small_long': return 3000 + 70 * km;
    case 'truck_large_short': return 2000 + 45 * km;
    case 'truck_large_long': return 4000 + 85 * km;
    case 'semi': return km <= 150? 10000 : 150 * km;
  }
};

const withCommission = (a: number, r: number): Price => ({
  total: Math.round(a),
  commission: Math.round(a * r),
  net: Math.round(a * (1 - r)),
});

export const calcLight = (w: number, km: number, d: number, v: LightVehicle = 'car') => {
  if (v === 'moto' && km > 15) return null;
  if (v === 'car' && w > 60) return null;
  const cat = getCategory(w, d);
  const zone = getZone(km);
  let base = PRICING[zone][cat];
  if (w > 10) base += (w - 10) * PRICING.overweight;
  return {...withCommission(base, COMMISSION.light), category: cat, zone };
};

export const calcDocuments = calcLight;

export const calcPharma = (w: number, km: number, d: number, med: number) => {
  const b = calcLight(w, km, d);
  if (!b) return null;
  return withCommission(b.total + med + 100, COMMISSION.light);
};

export const calcBouteille = (km: number, refill: number) => {
  const z = getZone(km);
  const base = (z === 'city' || z === 'wilaya'? PRICING.bouteille.inside : PRICING.bouteille.outside) + refill;
  return withCommission(base, COMMISSION.light);
};

export const calcDemenagement = (t: 'light' | 'full' | 'full_3', floors = 0, workers = 0, dismantle = false) => {
  let base = t === 'light'? PRICING.demenagement.light : t === 'full'? PRICING.demenagement.full : PRICING.demenagement.full3;
  base += floors * PRICING.demenagement.floor + workers * PRICING.demenagement.worker;
  if (dismantle) base += PRICING.demenagement.dismantle;
  return withCommission(base, COMMISSION.fleet);
};

export const calcVoyage = (t: 'small' | 'large') =>
  withCommission(t === 'small'? PRICING.voyage.small : PRICING.voyage.large, COMMISSION.fleet);

export const calcHilux = (km: number) => {
  const inside = km <= 150;
  const base = inside? PRICING.hilux.fixed : hiluxPrice(km);
  return {...withCommission(base, inside? COMMISSION.cargoInside : COMMISSION.cargoOutside), zone: getZone(km) };
};

export const calcFleet = (km: number, t: FleetType, frigo = false) => {
  let base = fleetBasePrice(km, t);
  if (frigo) base *= 1.2;
  return withCommission(base, COMMISSION.fleet);
};

export const calcLivestock = (c: number, km: number, a: 'sheep' | 'calf') => {
  const r = km > 150;
  let u = 0;
  if (a === 'sheep') u =!r? (c <= 5? 400 : c <= 10? 350 : 300) : c <= 5? 700 : c <= 10? 600 : 500;
  else u = r? 2500 : 1500;
  return withCommission(u * c, COMMISSION.fellah);
};

export const calcBoxes = (c: number, km: number, k: 'vegetable' | 'poultry' | 'rabbit') => {
  const r = km > 150;
  let total = 0;
  let forfait = false;

  if (k === 'vegetable') {
    if (c >= 21) { total = r? 9000 : 5000; forfait = true; }
    else { total = (r? (c <= 5? 600 : c <= 10? 540 : 500) : c <= 5? 300 : c <= 10? 270 : 250) * c; }
  }
  if (k === 'poultry') {
    if (c >= 10) { total = r? 7000 : 4000; forfait = true; }
    else { total = (r? (c <= 3? 1200 : c <= 5? 1100 : 1000) : c <= 3? 600 : c <= 5? 550 : 500) * c; }
  }
  if (k === 'rabbit') {
    total = (r? (c <= 3? 1000 : c <= 5? 900 : 800) : c <= 3? 500 : c <= 5? 450 : 400) * c;
  }

  return {...withCommission(total, COMMISSION.fellah), forfait };
};

export const checkDebt = (cur: number, next: number) => {
  const n = cur + next;
  return { allowed: n <= DEBT_LIMIT, next: n, blocked: n >= DEBT_LIMIT };
};