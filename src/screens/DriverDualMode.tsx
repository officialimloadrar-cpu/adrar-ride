import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import { calculateRide, createDebt, prixLight, type RideInput } from "../services/pricingEngine";
import { SERVICES } from "../theme/services.config";

type OrderStatus = "pending" | "accepted";

interface CorsaOrder {
  id: string;
  origin: string;
  dest: string;
  distance: number;
  seats: 1 | 2 | 3 | 4;
  type: "private" | "collective";
  status: OrderStatus;
}

interface ColisOrder {
  id: string;
  origin: string;
  dest: string;
  distance: number;
  weight: number;
  dim: number;
  vehicle: "moto" | "voiture";
  total: number;
  status: OrderStatus;
}

interface Props {
  driverId: string;
}

function usePendingOrders() {
  const [corsas, setCorsas] = useState<CorsaOrder[]>([]);
  const [colis, setColis] = useState<ColisOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [corsaRes, colisRes] = await Promise.all([
        supabase.from("corsa_orders").select("*").eq("status", "pending").limit(20),
        supabase.from("colis_orders").select("*").eq("status", "pending").limit(20),
      ]);
      if (corsaRes.error) throw corsaRes.error;
      if (colisRes.error) throw colisRes.error;
      setCorsas(corsaRes.data as CorsaOrder[]);
      setColis(colisRes.data as ColisOrder[]);
    } catch (err) {
      setError(err instanceof Error? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { corsas, colis, isLoading, error, refresh };
}

export default function DriverDualMode({ driverId }: Props) {
  const { corsas, colis, isLoading, error, refresh } = usePendingOrders();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const handleAcceptCorsa = useCallback(async (order: CorsaOrder) => {
    try {
      setAcceptingId(order.id);
      const pricing = calculateRide({ distance: order.distance, type: order.type, seats: order.seats } as RideInput);
      const { error: updateError } = await supabase.from("corsa_orders").update({ status: "accepted", driver_id: driverId }).eq("id", order.id);
      if (updateError) throw updateError;
      await Promise.all([
        supabase.from("driver_debts").insert(createDebt(driverId, order.id, pricing)),
        supabase.from("trips").insert({ driver_id: driverId, corsa_id: order.id, total_price: pricing.finalPrice, status: "accepted" }),
      ]);
      await refresh();
    } finally {
      setAcceptingId(null);
    }
  }, [driverId, refresh]);

  const handleAcceptColis = useCallback(async (order: ColisOrder) => {
    try {
      setAcceptingId(order.id);
      const pricing = prixLight(order.weight, order.dim, order.distance, order.vehicle);
      const { error: updateError } = await supabase.from("colis_orders").update({ status: "accepted", driver_id: driverId }).eq("id", order.id);
      if (updateError) throw updateError;
      await Promise.all([
        supabase.from("driver_debts").insert(createDebt(driverId, order.id, pricing)),
        supabase.from("trips").insert({ driver_id: driverId, colis_id: order.id, total_price: pricing.total, status: "accepted" }),
      ]);
      await refresh();
    } finally {
      setAcceptingId(null);
    }
  }, [driverId, refresh]);

  const renderedCorsas = useMemo(() => corsas.map((order) => {
    const pricing = calculateRide({ distance: order.distance, type: order.type, seats: order.seats } as RideInput);
    const isAccepting = acceptingId === order.id;
    return (
      <div key={order.id} className="flex items-center justify-between rounded- bg-zinc-50 px-4 py-4">
        <div className="min-w-0">
          <p className="truncate text- font-bold text-zinc-900">{order.origin} → {order.dest}</p>
          <p className="mt-1 text- text-zinc-500">{order.distance}km • {order.seats} seats • {pricing.finalPrice} DZD</p>
        </div>
        <button disabled={isAccepting} onClick={() => handleAcceptCorsa(order)} className="ml-3 shrink-0 rounded-xl px-5 py-2 text-xs font-bold text-white disabled:opacity-50" style={{ backgroundColor: SERVICES.corsa.color }}>{isAccepting? "..." : "Accept"}</button>
      </div>
    );
  }), [corsas, acceptingId, handleAcceptCorsa]);

  const renderedColis = useMemo(() => colis.map((order) => {
    const isAccepting = acceptingId === order.id;
    return (
      <div key={order.id} className="flex items-center justify-between rounded- bg-zinc-50 px-4 py-4">
        <div className="min-w-0">
          <p className="truncate text- font-bold text-zinc-900">{order.origin} → {order.dest}</p>
          <p className="mt-1 text- text-zinc-500">{order.weight}kg • {order.total} DZD</p>
        </div>
        <button disabled={isAccepting} onClick={() => handleAcceptColis(order)} className="ml-3 shrink-0 rounded-xl px-5 py-2 text-xs font-bold text-white disabled:opacity-50" style={{ backgroundColor: SERVICES.colis.color }}>{isAccepting? "..." : "Accept"}</button>
      </div>
    );
  }), [colis, acceptingId, handleAcceptColis]);

  if (isLoading) return <div className="mx-auto max-w-md rounded- bg-white p-6 shadow-sm"><p className="text-sm text-zinc-400">Loading orders...</p></div>;
  if (error) return <div className="mx-auto max-w-md rounded- bg-white p-6 shadow-sm"><p className="text-sm font-bold text-red-500">{error}</p></div>;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <section className="rounded- bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SERVICES.corsa.color }} />
          <h2 className="text- font-bold text-zinc-900">Corsa</h2>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text- font-bold text-zinc-600">{corsas.length}</span>
        </div>
        <div className="mt-4 space-y-2.5">{corsas.length === 0? <p className="py-6 text-center text-sm text-zinc-400">No pending orders</p> : renderedCorsas}</div>
      </section>
      <section className="rounded- bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SERVICES.colis.color }} />
          <h2 className="text- font-bold text-zinc-900">Colis</h2>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text- font-bold text-zinc-600">{colis.length}</span>
        </div>
        <div className="mt-4 space-y-2.5">{colis.length === 0? <p className="py-6 text-center text-sm text-zinc-400">No pending orders</p> : renderedColis}</div>
      </section>
    </div>
  );
}