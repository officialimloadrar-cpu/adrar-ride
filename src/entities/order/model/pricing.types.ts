export type Zone = "city" | "wilaya" | "outside";
export type LightSize = "small" | "medium" | "large";
export type VehicleType = "moto" | "car" | "triporteur" | "h100" | "hilux" | "fourgon_court" | "fourgon_long" | "camion_petit_court" | "camion_petit_long" | "camion_grand_court" | "camion_grand_long" | "semi";

export interface PriceResult {
  total: number;
  driver: number;
  platform: number;
  commissionRate: number;
}