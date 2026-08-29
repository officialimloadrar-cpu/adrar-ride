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
  driverId?: string;
}

export default function DriverDualMode({ driverId = 'driver-adrar-001' }: Props) {
  const [corsas, setCorsas] = useState<CorsaOrder[]>([]);
  const [colis, setColis] = useState<ColisOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbg, setDbg] = useState<string>('init...');

  const fetchPending = useCallback(async () => {
    setLoading(true);
    const envOk = import.meta.env.VITE_SUPABASE_URL? 'ENV OK' : 'ENV MISSING!';
    try {
      const [corsaRes, colisRes] = await Promise.all([
        supabase.from('corsa_orders').select('*').eq('status', 'pending').limit(20),
        supabase.from('colis_orders').select('*').eq('status', 'pending').limit(20),
      ]);

      let msg = `${envOk} | `;
      if (corsaRes.error) msg += `Corsa ERR: ${corsaRes.error.message} | `;
      else msg += `Corsa: ${corsaRes.data?.length} | `;

      if (colisRes.error) msg += `Colis ERR: ${colisRes.error.message}`;
      else msg += `Colis: ${colisRes.data?.length}`;

      setDbg(msg);

      if (corsaRes.data) setCorsas(corsaRes.data as CorsaOrder[]);
      if (colisRes.data) setColis(colisRes.data as ColisOrder[]);
    } catch (e: any) {
      setDbg(`CATCH: ${e.message} | ${envOk}`);
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

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="bg-yellow-300 text-black p-2 text-xs font-mono mb-4 rounded">{dbg}</div>
      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <h2 className="font-bold text-lg mb-3">Pending Corsa ({corsas.length})</h2>
          {corsas.length === 0 && <div className="text-gray-500">No pending corsa - {dbg}</div>}
          {corsas.map((o) => (
            <div key={o.id} className="border p-3 rounded mb-2 flex justify-between items-center">
              <span>{o.origin} → {o.dest} | {o.distance}km | {o.seats} مقاعد</span>
              <button onClick={() => acceptCorsa(o)} className="bg-black text-white px-3 py-1 rounded">Accept</button>
            </div>
          ))}
        </section>
        <section>
          <h2 className="font-bold text-lg mb-3">Pending Colis ({colis.length})</h2>
          {colis.length === 0 && <div className="text-gray-500">No pending colis</div>}
          {colis.map((o) => (
            <div key={o.id} className="border p-3 rounded mb-2 flex justify-between items-center">
              <span>{o.origin} → {o.dest} | {o.weight}kg</span>
              <button onClick={() => acceptColis(o)} className="bg-blue-600 text-white px-3 py-1 rounded">Accept</button>
            </div>
          ))}
        </section>
      </div>
      <button onClick={fetchPending} className="mt-6 w-full border py-2 rounded">🔄 Refresh</button>
    </div>
  );
}