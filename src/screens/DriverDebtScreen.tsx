import { useEffect, useState, useCallback } from "react";
import { getUnpaidTotal, createSettlement, type SettlementMethod } from "../services/driverSettlementService";
import { SERVICES } from "../theme/services.config";

interface Props {
  driverId: string;
}

export default function DriverDebtScreen({ driverId }: Props) {
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<SettlementMethod>("cash_office");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const value = await getUnpaidTotal(driverId);
      setTotal(value);
    } finally {
      setLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = useCallback(async () => {
    if (!amount || amount <= 0) return;
    setSubmitting(true);
    try {
      await createSettlement({ driverId, amount, method, reference });
      await refresh();
      setAmount(0);
      setReference("");
    } finally {
      setSubmitting(false);
    }
  }, [driverId, amount, method, reference, refresh]);

  return (
    <div className="mx-auto max-w-md rounded- bg-white p-6 shadow-sm">
      <p className="text-sm text-zinc-500">Unpaid Balance</p>
      <p className="mt-1 text-3xl font-bold text-zinc-900">{loading? "..." : `${total} DZD`}</p>
      <input type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" className="mt-5 w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none" />
      <select value={method} onChange={(e) => setMethod(e.target.value as SettlementMethod)} className="mt-3 w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none">
        <option value="cash_office">Cash at Office</option>
        <option value="baridimob">BaridiMob</option>
        <option value="ccp">CCP</option>
      </select>
      <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Reference / Receipt No" className="mt-3 w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none" />
      <button onClick={submit} disabled={submitting ||!amount} className="mt-5 w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50" style={{ backgroundColor: SERVICES.corsa.color }}>{submitting? "Submitting..." : "Submit Settlement"}</button>
    </div>
  );
}