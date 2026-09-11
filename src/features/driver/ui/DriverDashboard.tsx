import { useEffect, useState, useCallback, useRef } from "react"
import { supabase } from "@/shared/lib/supabase"
import { Card } from "@/shared/ui/Card"
import { Button } from "@/shared/ui/button"
import { DriverServiceSelection } from "./DriverServiceSelection"
import { useSettlement } from "@/features/wallet/lib/useSettlement"
import { useTranslation } from "react-i18next"

type ServiceType = "ride" | "colis" | "cargo" | "rental" | "makla"

interface Driver {
  id: string
  services: ServiceType[] | null
}

interface Order {
  id: string
  type: ServiceType
  from_address: string
  to_address: string
  price: number
  status: string
  description: string
  created_at: string
  driver_id?: string
}

interface Props {
  driverId: string
}

export function DriverDashboard({ driverId }: Props) {
  const { t } = useTranslation()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [pendingOrders, setPendingOrders] = useState<Order[]>([])
  const [activeOrders, setActiveOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<ServiceType | "all">("all")
  const [newOrderSound, setNewOrderSound] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { settleOrder } = useSettlement()

  const loadDriver = useCallback(async () => {
    const { data } = await supabase.from("drivers").select("id, services").eq("id", driverId).single()
    if (data) setDriver(data as Driver)
    setLoading(false)
  }, [driverId])

  const loadPendingOrders = useCallback(async () => {
    if (!driver?.services || driver.services.length === 0) return
    let query = supabase.from("orders").select("*").eq("status", "pending").in("type", driver.services)
    if (activeFilter !== "all") query = query.eq("type", activeFilter)
    const { data } = await query.order("created_at", { ascending: false }).limit(50)
    if (data) setPendingOrders(data as Order[])
  }, [driver, activeFilter])

  const loadActiveOrders = useCallback(async () => {
    const { data } = await supabase.from("orders").select("*").eq("driver_id", driverId).eq("status", "accepted").order("created_at", { ascending: false })
    if (data) setActiveOrders(data as Order[])
  }, [driverId])

  useEffect(() => { loadDriver() }, [loadDriver])
  useEffect(() => { loadPendingOrders(); loadActiveOrders() }, [loadPendingOrders, loadActiveOrders])

  useEffect(() => {
    if (!driver?.services || driver.services.length === 0) return
    const channel = supabase.channel("orders-channel")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders", filter: "status=eq.pending" }, (payload: any) => {
        const newOrder = payload.new as Order
        if (driver.services?.includes(newOrder.type)) {
          if (activeFilter === "all" || activeFilter === newOrder.type) {
            setPendingOrders((prev) => [newOrder, ...prev])
            setNewOrderSound(true)
            audioRef.current?.play().catch(() => {})
            setTimeout(() => setNewOrderSound(false), 3000)
          }
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload: any) => {
        const updated = payload.new as Order
        if (updated.status !== "pending") setPendingOrders((prev) => prev.filter((o) => o.id !== updated.id))
        if (updated.driver_id === driverId) loadActiveOrders()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [driver, activeFilter, driverId, loadActiveOrders])

  const handleAccept = async (orderId: string) => {
    const { error } = await supabase.from("orders").update({ status: "accepted", driver_id: driverId }).eq("id", orderId)
    if (!error) { setPendingOrders((prev) => prev.filter((o) => o.id !== orderId)); loadActiveOrders() }
  }

  const handleDelivered = async (orderId: string) => {
    await supabase.from("orders").update({ status: "delivered" }).eq("id", orderId)
    await settleOrder(orderId)
    setActiveOrders((prev) => prev.filter((o) => o.id !== orderId))
  }

  if (loading) return <div className="p-6 text-sm">{t("loading")}</div>
  if (!driver || !driver.services || driver.services.length === 0) return <DriverServiceSelection driverId={driverId} onComplete={loadDriver} />

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{t("driver")} {newOrderSound && <span className="text-green-500 animate-pulse">● {t("new")}</span>}</h2>
        <span className="text-xs text-zinc-500">{driver.services.map((s) => t(s)).join(", ")}</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setActiveFilter("all")} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${activeFilter === "all" ? "bg-black text-white" : "bg-zinc-100"}`}>{t("all")}</button>
        {driver.services.map((service) => (
          <button key={service} onClick={() => setActiveFilter(service)} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap capitalize ${activeFilter === service ? "bg-black text-white" : "bg-zinc-100"}`}>{t(service)}</button>
        ))}
      </div>

      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-medium text-zinc-500">{t("active")} ({activeOrders.length})</div>
          {activeOrders.map((order) => (
            <Card key={order.id} className="p-4 space-y-2 border-zinc-900">
              <div className="flex justify-between items-start">
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 text-white uppercase">{t(order.type)} · {t("accepted")}</span>
                <span className="font-semibold text-sm">{order.price} {t("DZD")}</span>
              </div>
              <div className="text-sm">
                <div>{t("from")}: {order.from_address}</div>
                {order.to_address && <div>{t("to")}: {order.to_address}</div>}
              </div>
              <Button onClick={() => handleDelivered(order.id)} className="w-full">{t("delivered")}</Button>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="text-xs font-medium text-zinc-500">{t("pending")} ({pendingOrders.length})</div>
        {pendingOrders.length === 0 && <Card className="p-6 text-center text-sm text-zinc-500">{t("waiting")} {activeFilter === "all" ? t("orders") : t(activeFilter)}...</Card>}
        {pendingOrders.map((order) => (
          <Card key={order.id} className={`p-4 space-y-2 ${newOrderSound ? "border-green-500" : ""}`}>
            <div className="flex justify-between items-start">
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 uppercase">{t(order.type)}</span>
              <span className="font-semibold text-sm">{order.price} DZD</span>
            </div>
            <div className="text-sm">
              <div>{t("from")}: {order.from_address}</div>
              {order.to_address && <div>{t("to")}: {order.to_address}</div>}
              {order.description && <div className="text-xs text-zinc-500 mt-1">{order.description}</div>}
            </div>
            <Button onClick={() => handleAccept(order.id)} className="w-full">{t("accept")}</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
