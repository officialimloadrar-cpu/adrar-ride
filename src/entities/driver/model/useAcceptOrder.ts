import { useCallback, useState } from "react";
import { supabase } from "@/shared/lib/supabase";

type AcceptResult = {
  error: Error | null;
};

export const useAcceptOrder = () => {
  const [isLoading, setIsLoading] = useState(false);

  const accept = useCallback(async (orderId: string): Promise<AcceptResult> => {
    setIsLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Unauthorized");

      const { error } = await supabase
        .from("orders")
        .update({ status: "accepted", driver_id: data.user.id })
        .eq("id", orderId)
        .eq("status", "pending");

      if (error) throw error;

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { accept, isLoading };
};