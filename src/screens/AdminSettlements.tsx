import { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabase";
import { SERVICES } from "../theme/services.config";

interface Settlement {
  id: string;
  driver_id: string;
  amount: number;
  method: string;
  reference: string | null;
  status: string;
}

export default function AdminSettlements() {
  const [items, setItems] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("driver_settlements").select("*").eq("status", "pending_verification").order("created_at", { ascending: false });
    setItems((data as Settlement[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const verify = useCallback(async (id: string) => {
    await supabase.from("driver_settlements").update({ status: "verified" }).eq("id", id);
    await load();
  }, [load]);

  return (
    <div className="mx-auto max-w-md rounded- bg-white p-6 shadow-sm">
      <h1 className="text- font-bold text-zinc-900">Pending Settlements</h1>
      <div className="mt-4 space-y-2.5">
        {loading? <p className="text-sm text-zinc-400">Loading...</p> : items.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded- bg-zinc-50 px-4 py-3">
            <div>
              <p className="text- font-bold text-zinc-900">{s.driver_id} - {s.amount} DZD</p>
              <p className="text- text-zinc-500">{s.method} {s.reference?? ""}</p>
            </div>
            <button onClick={() => verify(s.id)} className="rounded-xl px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: SERVICES.corsa.color }}>Verify</button>
          </div>
        ))}
      </div>
    </div>
  );
}