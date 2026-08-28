export type Place = {
  name: string;
  displayName?: string;
  lat: number;
  lon: number;
};

export async function reverseGeocode(lat: number, lon: number): Promise<Place> {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  const data = await res.json();
  return { name: data.display_name, displayName: data.display_name, lat, lon };
}

export async function searchPlaces(query: string, _bias?: Place | null, _bbox?: any): Promise<Place[]> {  if (!query.trim()) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=dz`;
    const res = await fetch(url);
    const data = await res.json();
    return data.map((item: any) => ({
      name: item.display_name.split(',')[0],
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch {
    return [];
  }
}