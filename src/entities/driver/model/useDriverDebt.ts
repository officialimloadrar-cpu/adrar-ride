import { useMemo } from "react";
const DEBT_LIMIT = 2000;
export function useDriverDebt(accumulated: number = 0, expiresAt?: string | null) {
  const isBlocked = useMemo(() => {
    if (!expiresAt) return accumulated >= DEBT_LIMIT;
    return accumulated >= DEBT_LIMIT && new Date(expiresAt).getTime() > Date.now();
  }, [accumulated, expiresAt]);
  const timer = useMemo(() => {
    if (!expiresAt) return "--:--";
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "00:00";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }, [expiresAt]);
  return { debt: accumulated, isBlocked, timer, limit: DEBT_LIMIT, rows: [] as any[] };
}
