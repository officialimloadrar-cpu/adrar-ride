export type RideType = 'private' | 'collective' | 'location';
export type Seats = 1 | 2 | 3 | 4;
export type Zone = 'city' | 'inside' | 'outside';
export type Vehicle = 'touristique' | 'duster' | 'hilux' | 'fourgon' | 'h100' | 'triporteur' | 'voiture' | 'moto';

export type RideInput = {
  distance: number;
  type: RideType;
  seats: Seats;
  hour?: number;
  addFourthSeat?: boolean;
  locationDuration?: 'half' | 'full' | 'week' | 'month';
  vehicle?: Vehicle;
};

export type RideResult = {
  distance: number;
  type: RideType;
  seats: number;
  finalPrice: number;
  commission: number;
  driverEarning: number;
  isNight: boolean;
};

export type RideQuote = RideResult & { quotedAt: string };
export type ColisResult = { total: number; commissionRate: number; commission: number; netDriver: number; allowed: boolean; reason?: string };

const CORSA = {
  NIGHT_MULTIPLIER: 1.25,
  NIGHT_MIN: 250,
  COMMISSION_INSIDE: 0.13,
  COMMISSION_OUTSIDE: 0.15,
  LOCATION: {
    touristique: { half: 7000, full: 10000, week: 56000, month: 213000 },
    duster: { half: 9000, full: 13500, week: 70000, month: 260000 },
    hilux: { half: 10000, full: 15500, week: 80000, month: 300000 },
    fourgon: { half: 8000, full: 11500, week: 60000, month: 220000 },
  },
  SEATS: { TWO: 1.8333, THREE_SHORT: 2.6667, THREE_LONG: 2.5, FOUR_SHORT: 2.9667, FOUR_LONG: 2.8 },
} as const;

const COLIS = {
  MOTO_MAX_KM: 15,
  MOTO_MAX_KG: 15,
  VOITURE_MAX_KG: 60,
  HILUX_RATE: 53.89,
  COMMISSION_LIGHT: 0.15,
  COMMISSION_CARGO: 0.13,
  LIGHT_CITY: { small: 250, medium: 300, large: 500 },
  LIGHT_INSIDE: { small: 400, medium: 500, large: 700 },
  LIGHT_OUTSIDE: { small: 800, medium: 1000, large: 1300 },
  BOUTEILLE_CITY: 400,
  BOUTEILLE_OUTSIDE: 800,
  HILUX_INSIDE_FIXED: 1000,
  OVERWEIGHT_THRESHOLD: 10,
  OVERWEIGHT_RATE: 50,
} as const;

export const isNight = (h: number): boolean => h >= 21 || h < 6;
const getZone = (d: number): Zone => (d <= 15? 'city' : d <= 150? 'inside' : 'outside');

const getBaseCorsaPrice = (d: number): number => {
  if (d <= 5) return 150;
  if (d <= 10) return 150 + 10 * (d - 5);
  if (d <= 20) return 200;
  if (d <= 30) return 200 + 7 * (d - 20);
  if (d <= 80) return 270 + 6.6 * (d - 30);
  return 600 + 11.428 * (d - 80);
};

const getSeatMultiplier = (d: number, seats: Seats): number => {
  if (seats === 1) return 1;
  if (seats === 2) return CORSA.SEATS.TWO;
  if (seats === 3) return d <= 80? CORSA.SEATS.THREE_SHORT : CORSA.SEATS.THREE_LONG;
  return d <= 80? CORSA.SEATS.FOUR_SHORT : CORSA.SEATS.FOUR_LONG;
};

const applyNight = (price: number): number => Math.max(CORSA.NIGHT_MIN, Math.round(price * CORSA.NIGHT_MULTIPLIER));
const calcCommission = (total: number, rate: number) => {
  const commission = Math.round(total * rate);
  return { commission, net: total - commission };
};

export const calculateRide = (input: RideInput): RideResult => {
  if (input.distance <= 0 || input.distance > 600) throw new Error('Invalid distance');
  const hour = input.hour?? new Date().getHours();
  const night = isNight(hour);

  if (input.type === 'location') {
    const table = CORSA.LOCATION[input.vehicle as keyof typeof CORSA.LOCATION]?? CORSA.LOCATION.touristique;
    const base = (table as any)[input.locationDuration?? 'full'] + 2000;
    const finalPrice = Math.round(base);
    const { commission, net } = calcCommission(finalPrice, CORSA.COMMISSION_OUTSIDE);
    return { distance: input.distance, type: input.type, seats: 4, finalPrice, commission, driverEarning: net, isNight: night };
  }

  const seats = (input.addFourthSeat? 4 : input.seats) as Seats;
  let price = getBaseCorsaPrice(input.distance) * getSeatMultiplier(input.distance, seats);
  if (night) price = applyNight(price);

  const finalPrice = Math.round(price);
  const rate = input.distance <= 10? CORSA.COMMISSION_INSIDE : CORSA.COMMISSION_OUTSIDE;
  const { commission, net } = calcCommission(finalPrice, rate);

  return { distance: input.distance, type: input.type, seats, finalPrice, commission, driverEarning: net, isNight: night };
};

export const freezeQuote = (input: RideInput): RideQuote => ({...calculateRide(input), quotedAt: new Date().toISOString() });

export const prix_moto = (d: number): number | null => (d > COLIS.MOTO_MAX_KM? null : Math.max(250, 100 + 15 * d));
export const prix_voiture = (d: number): number => 300 + 18 * d;
export const prix_hilux = (d: number): number => Math.round(d * COLIS.HILUX_RATE);
export const prix_H100 = (d: number): number => 600 + 20 * d;
export const prix_fourgon_court = (d: number): number => 800 + 21 * d;
export const prix_fourgon_long = (d: number): number => 2000 + 60 * d;
export const prix_camion_petit_court = (d: number): number => 1500 + 35 * d;
export const prix_camion_petit_long = (d: number): number => 3000 + 70 * d;
export const prix_camion_grand_court = (d: number): number => 2000 + 45 * d;
export const prix_camion_grand_long = (d: number): number => 4000 + 85 * d;

type LightCategory = 'small' | 'medium' | 'large';
const getLightCategory = (w: number, dim: number): LightCategory => {
  if (dim > 60) return 'large';
  if (dim > 40) return 'medium';
  if (w < 2) return 'small';
  if (w <= 5) return 'medium';
  return 'large';
};

export const prixLight = (weight: number, dim: number, distance: number, vehicle: 'moto' | 'voiture'): ColisResult => {
  if (vehicle === 'moto' && distance > COLIS.MOTO_MAX_KM) return { total: 0, commissionRate: 0.15, commission: 0, netDriver: 0, allowed: false, reason: 'MOTO_DISTANCE' };
  if (vehicle === 'voiture' && weight > COLIS.VOITURE_MAX_KG) return { total: 0, commissionRate: 0.15, commission: 0, netDriver: 0, allowed: false, reason: 'WEIGHT_VOITURE' };
  if (vehicle === 'moto' && weight > COLIS.MOTO_MAX_KG) return { total: 0, commissionRate: 0.15, commission: 0, netDriver: 0, allowed: false, reason: 'WEIGHT_MOTO' };

  const zone = getZone(distance);
  const cat = getLightCategory(weight, dim);
  const table = zone === 'city'? COLIS.LIGHT_CITY : zone === 'inside'? COLIS.LIGHT_INSIDE : COLIS.LIGHT_OUTSIDE;
  const base = table[cat];
  const extra = weight > COLIS.OVERWEIGHT_THRESHOLD? (weight - COLIS.OVERWEIGHT_THRESHOLD) * COLIS.OVERWEIGHT_RATE : 0;
  const total = base + extra;
  const { commission, net } = calcCommission(total, COLIS.COMMISSION_LIGHT);
  return { total, commissionRate: COLIS.COMMISSION_LIGHT, commission, netDriver: net, allowed: true };
};

export const prixBouteille = (distance: number, fillPrice: number): ColisResult => {
  const zone = getZone(distance);
  const base = zone === 'outside'? COLIS.BOUTEILLE_OUTSIDE : COLIS.BOUTEILLE_CITY;
  const total = base + fillPrice;
  const { commission, net } = calcCommission(total, COLIS.COMMISSION_LIGHT);
  return { total, commissionRate: COLIS.COMMISSION_LIGHT, commission, netDriver: net, allowed: true };
};

export const prixHiluxColis = (distance: number): ColisResult => {
  const zone = getZone(distance);
  const total = zone === 'outside'? prix_hilux(distance) : COLIS.HILUX_INSIDE_FIXED;
  const rate = zone === 'outside'? COLIS.COMMISSION_CARGO : COLIS.COMMISSION_LIGHT;
  const { commission, net } = calcCommission(total, rate);
  return { total, commissionRate: rate, commission, netDriver: net, allowed: true };
};

export const prixFlotte = (vehicle: string, distance: number, isFrigo = false): ColisResult => {
  let base = 0;
  const zone = getZone(distance);
  switch (vehicle) {
    case 'h100': base = 600 + 20 * distance; break;
    case 'fourgon_court': base = 800 + 21 * distance; break;
    case 'fourgon_long': base = 2000 + 60 * distance; break;
    case 'camion_petit_court': base = 1500 + 35 * distance; break;
    case 'camion_petit_long': base = 3000 + 70 * distance; break;
    case 'camion_grand_court': base = 2000 + 45 * distance; break;
    case 'camion_grand_long': base = 4000 + 85 * distance; break;
    case 'semi': base = zone === 'outside'? 150 * distance : 10000; break;
    default: base = 600 + 20 * distance;
  }
  if (isFrigo) base *= 1.2;
  const { commission, net } = calcCommission(base, COLIS.COMMISSION_CARGO);
  return { total: Math.round(base), commissionRate: COLIS.COMMISSION_CARGO, commission, netDriver: net, allowed: true };
};

export const prixFellahMoutons = (qty: number, distance: number): ColisResult => {
  const zone = getZone(distance);
  const perHead = zone === 'outside'? (qty <= 5? 700 : qty <= 10? 600 : 500) : qty <= 5? 400 : qty <= 10? 350 : 300;
  const total = perHead * qty;
  const { commission, net } = calcCommission(total, COLIS.COMMISSION_LIGHT);
  return { total, commissionRate: COLIS.COMMISSION_LIGHT, commission, netDriver: net, allowed: true };
};

export const MATCHING_RULES = {
  corsa: { inside: 3, banlieue: 5, outside: 20 },
  light: { moto: { search: 3, max: 15 }, voiture: { search: 3, unlimited: true } },
  cargo: { search: 20 },
  bouteille: { forbidden: ['moto'] as Vehicle[], allowed: ['voiture', 'triporteur', 'h100'] as Vehicle[] },
} as const;

export const createDebt = (driverId: string, orderId: string, result: RideResult | ColisResult) => {
  const total = (result as RideResult).finalPrice?? (result as ColisResult).total;
  return { driver_id: driverId, order_id: orderId, commission_due: result.commission, total_order: total, paid: false, created_at: new Date().toISOString() };
};