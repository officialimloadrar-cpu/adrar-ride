import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type ColisOrder = {
  id: string;
  origin: string;
  dest: string;
  distance: number;
  total: number;
  net: number;
  weight: number;
};

type Props = { driverId: string };

export default function DriverColis({ driverId }: Props) {
  const [orders, setOrders] = useState<ColisOrder[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    const { data } = await supabase
     .from("colis_orders")
     .select("*")
     .eq("status", "pending")
     .order("created_at", { ascending: false });
    if (data) setOrders(data as ColisOrder[]);
  }, []);

  useEffect(() => {
    fetchPending();
    const ch = supabase.channel("colis").on("postgres_changes", { event: "*", schema: "public", table: "colis_orders" }, fetchPending).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchPending]);

  const handleAccept = useCallback(async (orderId: string) => {
    if (busyId) return;
    setBusyId(orderId);
    setError(null);
    const { error } = await supabase.from("colis_orders").update({ status: "accepted", driver_id: driverId }).eq("id", orderId).eq("status", "pending");
    if (error) setError("ALREADY_TAKEN");
    else await fetchPending();
    setBusyId(null);
  }, [busyId, driverId, fetchPending]);

  return (
    <div className="card">
      <h2>Pending Colis - {orders.length}</h2>
      {error && <div className="badge">{error}</div>}
      {orders.length === 0 && <div className="quote-row"><span>No pending orders</span></div>}
      {orders.map((o) => (
        <div key={o.id} className="quote">
          <div className="quote-row"><span>{o.origin} → {o.dest}</span><span>{o.distance}km</span></div>
          <div className="quote-row"><span>{o.weight}kg</span><span className="price">{o.total} DA</span></div>
          <div className="quote-row"><span>Net</span><span>{o.net} DA</span></div>
          <button className="btn" disabled={busyId === o.id} onClick={() => handleAccept(o.id)}>{busyId === o.id? "..." : "Accept"}</button>
        </div>
      ))}
    </div>
  );
}