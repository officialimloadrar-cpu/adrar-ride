import { getPrice } from "@/entities/pricing/model";
export function PriceEstimator(){
  const p=getPrice("transport",5,{seats:1} as any);
  return <div>Price: {p} DA</div>;
}
export default PriceEstimator;
