export type RideType = 'private' | 'collective' | 'location';
export type Seats = 1 | 2 | 3 | 4;

export type Input = {
  distance: number;
  type: RideType;
  seats: Seats;
  zone?: string;
  hour?: number;
  addFourthSeat?: boolean;
  locationDuration?: 'half' | 'full' | 'week' | 'month';
  vehicle?: 'touristique' | 'duster' | 'hilux' | 'fourgon';
};

export type Result = {
  distance: number;
  type: RideType;
  seats: number;
  finalPrice: number;
  commission: number;
  driverEarning: number;
  isNight: boolean;
};

export type RideQuote = Result & { quotedAt: string };

const C = {
  col: { base: 50, km: 9, night: 1.25, min: 200 },
  priv: { base: 150, km: 22, extra: 350 },
  seats2: 1.8333, // ← تصحيح من 1.9
} as const;

export const isNight = (h: number) => h >= 21 || h < 6;

const prixLocation = (d: string, v: string) => {
  const t: any = {
    touristique: { half: 7000, full: 10000, week: 56000, month: 213000 },
    duster: { half: 9000, full: 13500, week: 70000, month: 260000 },
    hilux: { half: 10000, full: 15500, week: 80000, month: 300000 },
  };
  return (t[v]?.[d] || 10000) + 2000;
};

export const calculateRide = (input: Input): Result => {
  if (input.distance <= 0 || input.distance > 600) throw new Error('Invalid distance');
  const hour = input.hour?? new Date().getHours();
  const night = isNight(hour);

  if (input.type === 'location') {
    const finalPrice = Math.round(prixLocation(input.locationDuration || 'full', input.vehicle || 'touristique'));
    const commission = Math.round(finalPrice * 0.15);
    return { distance: input.distance, type: input.type, seats: 4, finalPrice, commission, driverEarning: finalPrice - commission, isNight: night };
  }

  const c1 = Math.max(C.col.min, C.col.base + C.col.km * input.distance);
  const p3 = C.priv.base + C.priv.km * input.distance;
  let price = input.type === 'private' || input.seats >= 3
   ? p3 + (input.addFourthSeat? C.priv.extra : 0)
    : input.seats === 2? c1 * C.seats2 : c1;

  if (night && input.type === 'collective') price *= C.col.night;

  const finalPrice = Math.round(price);
  const rate = input.distance <= 10? 0.13 : 0.15; // ← تصحيح العمولة
  const commission = Math.round(finalPrice * rate);

  return {
    distance: input.distance,
    type: input.type,
    seats: input.addFourthSeat? 4 : input.seats,
    finalPrice,
    commission,
    driverEarning: finalPrice - commission,
    isNight: night,
  };
};

export const freezeQuote = (input: Input): RideQuote => ({
 ...calculateRide(input),
  quotedAt: new Date().toISOString(),
});