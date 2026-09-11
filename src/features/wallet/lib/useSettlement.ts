import { useCallback } from "react"
import { supabase } from "@/shared/lib/supabase"

const FEE_RATE = 0.15

function resolveShift(date: Date): "DAY" | "NIGHT" {
  const h = date.getHours()
  return h >= 20 || h < 6 ? "NIGHT" : "DAY"
}

export function useSettlement() {
  const settleOrder = useCallback(async (orderId: string) => {
    const { data: order } = await supabase
      .from("orders")
      .select("id, price, driver_id, type, created_at")
      .eq("id", orderId)
      .single()

    if (!order || !order.driver_id) return

    const fee = Math.round(order.price * FEE_RATE)
    const net = order.price - fee
    const shift = resolveShift(new Date(order.created_at))

    await supabase.from("transactions").insert({
      order_id: order.id,
      driver_id: order.driver_id,
      amount: order.price,
      fee,
      net,
      shift,
      service: order.type,
    })

    const { data: wallet } = await supabase
      .from("driver_wallets")
      .select("id, balance, total_earnings, total_fees, total_trips")
      .eq("driver_id", order.driver_id)
      .single()

    if (wallet) {
      await supabase
        .from("driver_wallets")
        .update({
          balance: wallet.balance + net,
          total_earnings: wallet.total_earnings + net,
          total_fees: wallet.total_fees + fee,
          total_trips: wallet.total_trips + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", wallet.id)
    } else {
      await supabase.from("driver_wallets").insert({
        driver_id: order.driver_id,
        balance: net,
        total_earnings: net,
        total_fees: fee,
        total_trips: 1,
      })
    }
  }, [])

  return { settleOrder }
}