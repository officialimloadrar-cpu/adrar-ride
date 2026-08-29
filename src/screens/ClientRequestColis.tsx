import { useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import { prixLight } from "../services/pricingEngine";
import { SERVICES } from "../theme/services.config";
import { SERVICE_COLORS } from "../theme/colors";

export default function ClientRequestColis({ clientId, onCreated }: { clientId: string; onCreated: () => void }) {
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [distance, setDistance] = useState(5);
  const [weight, setWeight] = useState(1);
  const [dim, setDim] = useState(10);
  const [vehicle, setVehicle] = useState<"moto" | "voiture">("moto");
  const [isLoading, setIsLoading] = useState(false);

  const pricing = useMemo(() => prixLight(weight, dim, distance, vehicle), [weight, dim, distance, vehicle]);

  const handleSubmit = async () => {
    setIsLoading(true);
    await supabase.from("colis_orders").insert({ client_id: clientId, origin, dest, distance, weight, dim, vehicle, total: pricing.total, status: "pending" });
    setIsLoading(false);
    onCreated();
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: SERVICE_COLORS.bg }}>
      <div className="mx-auto max-w-md space-y-4 rounded- bg-white p-6 shadow-sm">
        <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none" />
        <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="Destination" className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none" />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" min={1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} placeholder="Weight kg" className="rounded-xl bg-zinc-50 px-3 py-3 text-sm outline-none" />
          <input type="number" min={1} value={dim} onChange={(e) => setDim(Number(e.target.value))} placeholder="Dim cm" className="rounded-xl bg-zinc-50 px-3 py-3 text-sm outline-none" />
        </div>
        <div className="flex items-center gap-3">
          <input type="range" min={1} max={100} value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="flex-1" />
          <span className="text-sm">{distance} km</span>
        </div>
        <select value={vehicle} onChange={(e) => setVehicle(e.target.value as "moto" | "voiture")} className="w-full rounded-xl bg-zinc-50 px-3 py-3 text-sm outline-none">
          <option value="moto">Moto</option><option value="voiture">Voiture</option>
        </select>
        <div className="flex justify-between text-sm font-bold"><span>Total</span><span>{pricing.total} DZD</span></div>
        <button disabled={isLoading ||!origin ||!dest} onClick={handleSubmit} className="w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50" style={{ backgroundColor: SERVICES.colis.color }}>
          {isLoading? "..." : "Request Colis"}
        </button>
      </div>
    </div>
  );
}