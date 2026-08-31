import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";

export const useOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then((res: any) => {
      setOrders(res.data ?? []);
      setLoading(false);
    });
  }, []);

  return { orders, loading };
};