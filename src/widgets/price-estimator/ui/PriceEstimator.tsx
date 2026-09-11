import { useState } from "react";
import { getPriceBreakdown } from "@/services/pricingEngine";

export function PriceEstimator() {
  const [d] = useState(5);
  const b = getPriceBreakdown({ mode: "standard", distanceKm: d });
  return <div>Price: {b.total} {b.currency}</div>;
}
export default PriceEstimator;