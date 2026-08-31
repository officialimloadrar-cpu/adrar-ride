import { PRICING } from "@/shared/lib/constants";
export const calcTransport = (distance: number, seats: number, isNight: boolean) => {
  let total = 0;
  if (distance <= 5) total = 150;
  else if (distance <= 10) total = 150 + (distance - 5) * 10;
  else if (distance <= 20) total = 200;
  else if (distance <= 30) total = 200 + (distance - 20) * 7;
  else if (distance <= 80) total = 270 + (distance - 30) * 6.6;
  else total = 600 + (distance - 80) * 11.428;
  const factor = PRICING.SEAT_FACTORS[Math.min(Math.max(seats,1),4)-1];
  total = total * factor;
  if (isNight) total = Math.max(PRICING.NIGHT_MIN, total * PRICING.NIGHT_MULT);
  return Math.round(total);
};
export const calcTransportDetailed = (distance: number, seats: number, isNight: boolean) => {
  const base = calcTransport(distance, 1, false);
  const withSeats = calcTransport(distance, seats, false);
  const final = calcTransport(distance, seats, isNight);
  return { base, withSeats, final, isNightApplied: final !== withSeats };
};
