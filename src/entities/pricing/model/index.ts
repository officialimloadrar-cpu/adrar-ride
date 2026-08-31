export * from "./pricingEngineTransport";
export * from "./pricingEngineColis";
export * from "./commission";
export * from "./parcel";
export * from "./distanceEngine";
import { calcTransport } from "./pricingEngineTransport";
import { calcParcel } from "./parcel";
export type VehicleType="moto"|"sedan"|"suv"|"van";
export const getPrice=(type:"transport"|"colis",distance:number,opts:any={})=>{
  if(type==="transport") return calcTransport(distance, opts.seats||1, opts.isNight||false);
  return calcParcel(opts.weight||1, opts.dim||30, distance);
};
