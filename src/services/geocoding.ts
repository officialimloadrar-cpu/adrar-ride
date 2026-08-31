
export interface Place{ lat:number; lng:number; address:string; distanceKm?:number }
export async function reverseGeocode(lat:number,lng:number):Promise<Place>{ return { lat,lng, address:`${lat.toFixed(5)}, ${lng.toFixed(5)}` } }
export async function searchPlaces(q:string):Promise<Place[]>{ return [] }
export function haversine(a:{lat:number,lng:number},b:{lat:number,lng:number}){ const R=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLng=(b.lng-a.lng)*Math.PI/180; const s1=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2; return R*2*Math.atan2(Math.sqrt(s1),Math.sqrt(1-s1)) }
