export const COUNTRIES = {
  DZ: {
    code: "DZ",
    name: "Algeria",
    bbox: [-8.668, 18.976, 11.986, 37.332] as [number, number, number, number],
    center: { lat: 28.0339, lon: 1.6596 },
    currency: "DZD",
  },
} as const;

export type CountryCode = keyof typeof COUNTRIES;

export async function getRegions(countryCode: string): Promise<string[]> {
  const cached = localStorage.getItem(`regions_${countryCode}`);
  if (cached) {
    try {
      return JSON.parse(cached) as string[];
    } catch {}
  }
  try {
    const res = await fetch(`https://api.imrcoursa.com/regions?country=${countryCode}`);
    if (!res.ok) throw new Error("failed");
    const data = await res.json();
    const regions = data.regions || data || [];
    if (Array.isArray(regions) && regions.length) {
      localStorage.setItem(`regions_${countryCode}`, JSON.stringify(regions));
      return regions;
    }
  } catch {}
  return [];
}