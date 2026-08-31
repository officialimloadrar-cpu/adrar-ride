export const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};
export const zoneFromDistance = (d: number) => d <= 15 ? "city" : d <= 150 ? "region" : "national";
export const isEligible = (driverLat: number, driverLon: number, orderLat: number, orderLon: number, vehicle: string) => {
  const d = haversine(driverLat, driverLon, orderLat, orderLon);
  if (vehicle === "moto") return d <= 3;
  if (vehicle === "car") return true;
  return d <= 20;
};
export const filterNearby = (drivers: {lat:number,lon:number,vehicle:string}[], order:{lat:number,lon:number,service:string}) => drivers.filter(dr => isEligible(dr.lat, dr.lon, order.lat, order.lon, order.service));
