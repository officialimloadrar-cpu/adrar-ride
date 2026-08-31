export const RADIUS = { MOTO: 3, VEHICLE: 20 } as const;
export type VehicleType = "moto" | "vehicle";

export const isMatchable = (distanceKm: number, type: VehicleType): boolean =>
  type === "moto" ? distanceKm <= RADIUS.MOTO : distanceKm <= RADIUS.VEHICLE;// placeholder - future service - inactive
