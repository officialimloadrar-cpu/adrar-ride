import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import { calculateRide, createDebt, prixLight, type RideInput } from "../services/pricingEngine";

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
    } catch (err: any) {
      setError(err.message);
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

      const { error: updateError } = await supabase
       .from("corsa_orders")
       .update({ status: "accepted", driver_id: driverId })
       .eq("id", order.id);

      if (updateError) throw updateError;

      await Promise.all([
        supabase.from("driver_debts").insert(createDebt(driverId, order.id, pricing)),
        supabase.from("trips").insert({
          driver_id: driverId,
          corsa_id: order.id,
          total_price: pricing.finalPrice,
          status: "accepted",
        }),
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

      const { error: updateError } = await supabase
       .from("colis_orders")
       .update({ status: "accepted", driver_id: driverId })
       .eq("id", order.id);

      if (updateError) throw updateError;

      await Promise.all([
        supabase.from("driver_debts").insert(createDebt(driverId, order.id, pricing)),
        supabase.from("trips").insert({
          driver_id: driverId,
          colis_id: order.id,
          total_price: pricing.total,
          status: "accepted",
        }),
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
      <div key={order.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div>
          <p className="font-medium">{order.origin} → {order.dest}</p>
          <p className="text-xs text-zinc-400">{order.distance}km • {order.seats} seats • {pricing.finalPrice} DZD</p>
        </div>
        <button
          disabled={isAccepting}
          onClick={() => handleAcceptCorsa(order)}
          className="rounded bg-white px-4 py-1.5 text-sm font-semibold text-black disabled:opacity-50"
        >
          {isAccepting? "..." : "Accept"}
        </button>
      </div>
    );
  }), [corsas, acceptingId, handleAcceptCorsa]);

  const renderedColis = useMemo(() => colis.map((order) => {
    const isAccepting = acceptingId === order.id;
    return (
      <div key={order.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div>
          <p className="font-medium">{order.origin} → {order.dest}</p>
          <p className="text-xs text-zinc-400">{order.weight}kg • {order.total} DZD</p>
        </div>
        <button
          disabled={isAccepting}
          onClick={() => handleAcceptColis(order)}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isAccepting? "..." : "Accept"}
        </button>
      </div>
    );
  }), [colis, acceptingId, handleAcceptColis]);

  if (isLoading) return <div className="p-6 text-zinc-400">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="grid gap-8 md:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Pending Corsa ({corsas.length})</h2>
          {corsas.length === 0? <p className="text-zinc-500">No pending orders</p> : renderedCorsas}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Pending Colis ({colis.length})</h2>
          {colis.length === 0? <p className="text-zinc-500">No pending orders</p> : renderedColis}
        </section>
      </div>
    </div>
  );
}