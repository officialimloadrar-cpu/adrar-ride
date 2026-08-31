export const haversine = (a:{lat:number,lon:number}, b:{lat:number,lon:number}) => {
  const R=6371, dLat=(b.lat-a.lat)*Math.PI/180, dLon=(b.lon-a.lon)*Math.PI/180;
  const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s));
};
export const calcETA = (distanceKm:number, speedKmh=40) => Math.round((distanceKm/speedKmh)*60);
export const interpolate = (from:{lat:number,lon:number}, to:{lat:number,lon:number}, t:number) => ({ lat: from.lat + (to.lat-from.lat)*t, lon: from.lon + (to.lon-from.lon)*t });
export const trackingChannel = (orderId:string) => `tracking:${orderId}`;
