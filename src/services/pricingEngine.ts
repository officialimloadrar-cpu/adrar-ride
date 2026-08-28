export type RideType = 'private' | 'collective';
export type Seats = 1 | 2 | 3 | 4;

export type Input = {
  distance: number;
  type: RideType;
  seats: Seats;
  zone?: string;
  hour?: number;
  addFourthSeat?: boolean;
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

export type RideQuote = Result & {
  quotedAt: string;
};

const C = {
  col: { base: 50, km: 9, night: 1.25, min: 200 },
  priv: { base: 150, km: 22, extra: 350 },
  seats2: 1.9,
  fee: 0.15,
} as const;

export const isNight = (h: number) => h >= 21 || h < 6;

export const calculateRide = (input: Input): Result => {
  if (input.distance <= 0 || input.distance > 500) throw new Error('Invalid distance');

  const hour = input.hour ?? new Date().getHours();
  const night = isNight(hour);

  const c1 = Math.max(C.col.min, C.col.base + C.col.km * input.distance);
  const p3 = C.priv.base + C.priv.km * input.distance;

  let price = input.type === 'private' || input.seats >= 3
    ? p3 + (input.addFourthSeat ? C.priv.extra : 0)
    : input.seats === 2
      ? c1 * C.seats2
      : c1;

  if (night && input.type === 'collective') price *= C.col.night;

  const finalPrice = Math.round(price);
  const commission = Math.round(finalPrice * C.fee);

  return {
    distance: input.distance,
    type: input.type,
    seats: input.addFourthSeat ? 4 : input.seats,
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