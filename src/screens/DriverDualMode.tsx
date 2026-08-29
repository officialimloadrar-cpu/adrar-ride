import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { calculateRide, prixLight, createDebt, type RideInput } from '../services/pricingEngine';

interface CorsaOrder {
  id: string;
  origin: string;
  dest: string;
  distance: number;
  seats: 1 | 2 | 3 | 4;
  type: 'private' | 'collective';
  status: string;
}

interface ColisOrder {
  id: string;
  origin: string;
  dest: string;
  distance: number;
  weight: number;
  dim: number;
  vehicle: 'moto' | 'voiture';
  total: number;
  status: string;
}

interface Props {
  driverId: string;
}

export default function DriverDualMode({ driverId }: Props) {
  const [corsas, setCorsas] = useState<CorsaOrder[]>([]);
  const [colis, setColis] = useState<ColisOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const [corsaRes, colisRes] = await Promise.all([
        supabase.from('corsa_orders').select('*').eq('status', 'pending').limit(10),
        supabase.from('colis_orders').select('*').eq('status', 'pending').limit(10),
      ]);
      if (corsaRes.data) setCorsas(corsaRes.data as CorsaOrder[]);
      if (colisRes.data) setColis(colisRes.data as ColisOrder[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const acceptCorsa = async (order: CorsaOrder) => {
    const input: RideInput = { distance: order.distance, type: order.type, seats: order.seats };
    const result = calculateRide(input);
    const debt = createDebt(driverId, order.id, result);

    await supabase.from('corsa_orders').update({ status: 'accepted', driver_id: driverId }).eq('id', order.id);
    await supabase.from('driver_debts').insert(debt);
    await supabase.from('trips').insert({ driver_id: driverId, corsa_id: order.id, total_price: result.finalPrice, status: 'accepted' });
    await fetchPending();
  };

  const acceptColis = async (order: ColisOrder) => {
    const result = prixLight(order.weight, order.dim, order.distance, order.vehicle);
    const debt = createDebt(driverId, order.id, result);

    await supabase.from('colis_orders').update({ status: 'accepted', driver_id: driverId }).eq('id', order.id);
    await supabase.from('driver_debts').insert(debt);
    await supabase.from('trips').insert({ driver_id: driverId, colis_id: order.id, total_price: result.total, status: 'accepted' });
    await fetchPending();
  };

  const acceptCombo = async (corsa: CorsaOrder, colisOrder: ColisOrder) => {
    const corsaResult = calculateRide({ distance: corsa.distance, type: corsa.type, seats: corsa.seats });
    const colisResult = prixLight(colisOrder.weight, colisOrder.dim, colisOrder.distance, colisOrder.vehicle);

    await supabase.from('corsa_orders').update({ status: 'accepted', driver_id: driverId }).eq('id', corsa.id);
    await supabase.from('colis_orders').update({ status: 'accepted', driver_id: driverId }).eq('id', colisOrder.id);
    await supabase.from('driver_debts').insert([createDebt(driverId, corsa.id, corsaResult), createDebt(driverId, colisOrder.id, colisResult)]);
    await supabase.from('trips').insert({ driver_id: driverId, corsa_id: corsa.id, colis_id: colisOrder.id, total_price: corsaResult.finalPrice + colisResult.total, status: 'accepted' });
    await fetchPending();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 grid md:grid-cols-2 gap-6">
      <section>
        <h2 className="font-bold text-lg mb-3">Pending Corsa</h2>
        {corsas.map((o) => (
          <div key={o.id} className="border p-3 rounded mb-2 flex justify-between items-center">
            <span>{o.origin} → {o.dest} | {o.distance}km</span>
            <button onClick={() => acceptCorsa(o)} className="bg-black text-white px-3 py-1 rounded">Accept</button>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3">Pending Colis</h2>
        {colis.map((o) => (
          <div key={o.id} className="border p-3 rounded mb-2 flex justify-between items-center">
            <span>{o.origin} → {o.dest} | {o.weight}kg</span>
            <button onClick={() => acceptColis(o)} className="bg-blue-600 text-white px-3 py-1 rounded">Accept</button>
          </div>
        ))}
      </section>

      {corsas.length > 0 && colis.length > 0 && (
        <section className="md:col-span-2 border-t pt-4">
          <button onClick={() => acceptCombo(corsas[0], colis[0])} className="w-full bg-green-600 text-white py-3 rounded font-bold">
            Accept Combo Corsa + Colis
          </button>
        </section>
      )}
    </div>
  );
}