import { supabase } from "./supabase";

export type SettlementMethod = "cash_office" | "baridimob" | "ccp";

export interface CreateSettlementInput {
  driverId: string;
  amount: number;
  method: SettlementMethod;
  reference?: string;
}

interface DebtRow {
  amount: number;
}

export async function getUnpaidTotal(driverId: string): Promise<number> {
  const { data, error } = await supabase.from("driver_debts").select("amount").eq("driver_id", driverId).eq("status", "unpaid");
  if (error) throw error;
  return (data as DebtRow[]).reduce((sum, row) => sum + row.amount, 0);
}

export async function createSettlement(input: CreateSettlementInput): Promise<void> {
  const { error } = await supabase.from("driver_settlements").insert({
    driver_id: input.driverId,
    amount: input.amount,
    method: input.method,
    reference: input.reference?? null,
    status: "pending_verification",
  });
  if (error) throw error;
}