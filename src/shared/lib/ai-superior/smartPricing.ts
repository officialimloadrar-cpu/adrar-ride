export const demandFactor = (drivers:number, orders:number) => {
  if (drivers===0) return 1.3;
  const r = orders / Math.max(1,drivers);
  if (r>2) return 1.35;
  if (r>1) return 1.18;
  if (r<0.25) return 0.88;
  return 1;
};
export const timeFactor = (d=new Date()) => {
  const h=d.getHours();
  if (h>=21||h<6) return 1.25;
  if (h>=17&&h<=19) return 1.15;
  return 1;
};
export const weatherFactor = (isRain:boolean, isExtreme:boolean) => isExtreme?1.2:isRain?1.1:1;
export const optimize = (base:number, drivers:number, orders:number, date=new Date(), rain=false, extreme=false) => Math.round(base * demandFactor(drivers,orders) * timeFactor(date) * weatherFactor(rain,extreme));
