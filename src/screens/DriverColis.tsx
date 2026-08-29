import { useCallback, useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/fb";
import { acceptOrder } from "../services/wassliColis_service";

const COLLECTION = "colis_orders";

type ColisOrder = {
  id: string;
  origin: string;
  dest: string;
  distance: number;
  total: number;
  net: number;
  weight: number;
};

type Props = {
  driverId: string;
};

export default function DriverColis({ driverId }: Props) {
  const [orders, setOrders] = useState<ColisOrder[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), where("status", "==", "pending"));
    return onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ColisOrder)));
      },
      (err) => {
        console.error(err);
        setError(err.message);
      }
    );
  }, []);

  const handleAccept = useCallback(
    async (orderId: string) => {
      if (busyId) return;
      setBusyId(orderId);
      setError(null);
      try {
        await acceptOrder(orderId, driverId);
      } catch {
        setError("ALREADY_TAKEN");
      } finally {
        setBusyId(null);
      }
    },
    [busyId, driverId]
  );

  return (
    <div className="card">
      <h2>Pending Colis - {orders.length}</h2>
      {error && <div className="badge">{error}</div>}
      {orders.length === 0 && (
        <div className="quote-row">
          <span>No pending orders</span>
        </div>
      )}
      {orders.map((order) => (
        <div key={order.id} className="quote">
          <div className="quote-row">
            <span>{order.origin} → {order.dest}</span>
            <span>{order.distance}km</span>
          </div>
          <div className="quote-row">
            <span>{order.weight}kg</span>
            <span className="price">{order.total} DA</span>
          </div>
          <div className="quote-row">
            <span>Net</span>
            <span>{order.net} DA</span>
          </div>
          <button className="btn" disabled={busyId === order.id} onClick={() => handleAccept(order.id)}>
            {busyId === order.id ? "..." : "Accept"}
          </button>
        </div>
      ))}
    </div>
  );
}