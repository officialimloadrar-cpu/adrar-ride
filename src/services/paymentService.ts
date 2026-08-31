import { supabase } from "./supabase";
import type { RideQuote } from "./pricingEngine";

export type PaymentMethod = "cash" | "wallet";

export interface PaymentInput {
  tripId: string;
  driverId: string;
  clientId: string;
  quote: RideQuote;
  method: PaymentMethod;
}

export function getCommissionRate(distance: number, type: string): number {
  if (type === "location") return 0.15;
  return distance <= 10? 0.13 : 0.15;
}

export async function processRidePayment(input: PaymentInput) {
  const rate = getCommissionRate(input.quote.distance, input.quote.type);
  const commission = Math.round(input.quote.finalPrice * rate);
  const driverEarning = input.quote.finalPrice - commission;

  const { error } = await supabase.from("payments").insert({
    trip_id: input.tripId,
    driver_id: input.driverId,
    client_id: input.clientId,
    total: input.quote.finalPrice,
    commission,
    driver_earning: driverEarning,
    method: input.method,
    status: input.method === "cash"? "pending_collection" : "paid",
  });

  if (error) throw error;

  await supabase.from("driver_debts").insert({
    driver_id: input.driverId,
    trip_id: input.tripId,
    amount: commission,
    status: "unpaid",
  });

  return { commission, driverEarning };
}

export async function settleDriverDebt(driverId: string, amount: number) {
  const { error } = await supabase.from("driver_debts").update({ status: "paid" }).eq("driver_id", driverId).eq("status", "unpaid").lte("amount", amount);
  if (error) throw error;
}

export async function getDriverUnpaidTotal(driverId: string): Promise<number> {
  const { data, error } = await supabase.from("driver_debts").select("amount").eq("driver_id", driverId).eq("status", "unpaid");
  if (error) throw error;
  return data.reduce((sum: number, r: any) => sum + r.amount, 0);
}