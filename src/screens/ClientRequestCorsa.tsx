import { useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import { calculateRide, type RideInput } from "../services/pricingEngine";
import { SERVICES } from "../theme/services.config";
import { SERVICE_COLORS } from "../theme/colors";

export default function ClientRequestCorsa({ clientId, onCreated }: { clientId: string; onCreated: () => void }) {
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [distance, setDistance] = useState(5);
  const [seats, setSeats] = useState<1 | 2 | 3 | 4>(1);
  const [type, setType] = useState<"private" | "collective">("private");
  const [isLoading, setIsLoading] = useState(false);

  const pricing = useMemo(() => calculateRide({ distance, type, seats } as RideInput), [distance, type, seats]);

  const handleSubmit = async () => {
    setIsLoading(true);
    await supabase.from("corsa_orders").insert({ client_id: clientId, origin, dest, distance, seats, type, total: pricing.finalPrice, status: "pending" });
    setIsLoading(false);
    onCreated();
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: SERVICE_COLORS.bg }}>
      <div className="mx-auto max-w-md space-y-4 rounded- bg-white p-6 shadow-sm">
        <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none" />
        <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="Destination" className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none" />
        <div className="flex items-center gap-3">
          <input type="range" min={1} max={100} value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="flex-1" />
          <span className="text-sm">{distance} km</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={seats} onChange={(e) => setSeats(Number(e.target.value) as 1 | 2 | 3 | 4)} className="rounded-xl bg-zinc-50 px-3 py-3 text-sm outline-none">
            <option value={1}>1 seat</option><option value={2}>2 seats</option><option value={3}>3 seats</option><option value={4}>4 seats</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value as "private" | "collective")} className="rounded-xl bg-zinc-50 px-3 py-3 text-sm outline-none">
            <option value="private">Private</option><option value="collective">Collective</option>
          </select>
        </div>
        <div className="flex justify-between text-sm font-bold"><span>Total</span><span>{pricing.finalPrice} DZD</span></div>
        <button disabled={isLoading ||!origin ||!dest} onClick={handleSubmit} className="w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50" style={{ backgroundColor: SERVICES.corsa.color }}>
          {isLoading? "..." : "Request Corsa"}
        </button>
      </div>
    </div>
  );
}