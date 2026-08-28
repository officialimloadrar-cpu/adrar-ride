export type RouteResult = {
  distanceKm: number;
  durationMin: number;
  geometry: any;
};

export async function getRoute(from: {lat: number, lon: number}, to: {lat: number, lon: number}): Promise<RouteResult> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes?.[0]) throw new Error('No route found');

  const route = data.routes[0];
  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
    geometry: route.geometry
  };
}