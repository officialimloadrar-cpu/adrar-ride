import { useEffect, useState } from "react"
import { supabase } from "@/shared/lib/supabase"
import { Card } from "@/shared/ui/Card"
import { Button } from "@/shared/ui/button"

interface Order {
  id: string
  type: string
  from_address: string
  to_address: string
  price: number
  status: "pending" | "accepted" | "on_the_way" | "delivered" | "cancelled"
  driver_id: string | null
}

interface Driver {
  id: string
  phone: string
  name: string
}

interface Props {
  orderId: string
  onBack: () => void
}

export function TrackingPage({ orderId, onBack }: Props) {
  const [order, setOrder] = useState<Order | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("orders").select("*").eq("id", orderId).single()
      if (data) setOrder(data as Order)
    }
    load()

    const channel = supabase
      .channel(`order-${orderId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` }, (payload: any) => {
        setOrder(payload.new as Order)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId])

  useEffect(() => {
    if (!order?.driver_id) return
    const loadDriver = async () => {
      const { data } = await supabase.from("drivers").select("id, phone, name").eq("id", order.driver_id).single()
      if (data) setDriver(data as Driver)
    }
    loadDriver()
  }, [order?.driver_id])

  const handleCancel = async () => {
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId)
    onBack()
  }

  if (!order) return <div className="p-6 text-sm">Loading order...</div>

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <button onClick={onBack} className="text-sm text-gray-500">← Back</button>

      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 uppercase">{order.type}</span>
          <span className="font-bold">{order.price} DZD</span>
        </div>

        <div className="text-sm space-y-1">
          <div>From: {order.from_address}</div>
          <div>To: {order.to_address}</div>
        </div>

        <div className="border-t pt-4">
          {order.status === "pending" && (
            <div className="text-center space-y-3">
              <div className="animate-pulse text-yellow-600">🔍 Searching for driver...</div>
              <div className="text-xs text-gray-500">Drivers who work with {order.type} will see your request</div>
            </div>
          )}

          {order.status === "accepted" && driver && (
            <div className="space-y-3">
              <div className="text-green-600 font-medium">✅ Driver accepted!</div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{driver.name || "Driver"}</div>
                  <div className="text-xs text-gray-500">{driver.phone}</div>
                </div>
                <a href={`tel:${driver.phone}`} className="bg-black text-white px-4 py-2 rounded-full text-sm">Call</a>
              </div>
            </div>
          )}

          {order.status === "on_the_way" && (
            <div className="text-center text-blue-600 font-medium">🚗 Driver is on the way</div>
          )}

          {order.status === "delivered" && (
            <div className="text-center text-green-600 font-medium">🎉 Delivered - Thank you!</div>
          )}
        </div>

        {order.status === "pending" && (
          <Button onClick={handleCancel} className="w-full bg-white text-black border border-gray-200">
            Cancel Order
          </Button>
        )}
      </Card>
    </div>
  )
}
