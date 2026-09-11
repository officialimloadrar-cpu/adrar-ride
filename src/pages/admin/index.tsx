import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { isAdmin } from "@/shared/lib/adminGuard"

type Order = {
  id: string
  price: number
  commission: number
  distance_km: number
  is_night: boolean
  status: string
  type: string
  created_at: string
}

type Stats = {
  totalOrders: number
  totalCommission: number
  todayCommission: number
  pending: number
  accepted: number
  completed: number
}

export default function AdminPage() {
  const [pin, setPin] = useState("")
  const [ok, setOk] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalCommission: 0,
    todayCommission: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ok) return

    const fetchOrders = async () => {
      setLoading(true)
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100)
      if (data) {
        const list = data as Order[]
        setOrders(list)
        const today = new Date().toDateString()
        const todayOrders = list.filter((o) => new Date(o.created_at).toDateString() === today)
        setStats({
          totalOrders: list.length,
          totalCommission: list.reduce((sum, o) => sum + (o.commission || 0), 0),
          todayCommission: todayOrders.reduce((sum, o) => sum + (o.commission || 0), 0),
          pending: list.filter((o) => o.status === "pending").length,
          accepted: list.filter((o) => o.status === "accepted").length,
          completed: list.filter((o) => o.status === "completed").length,
        })
      }
      setLoading(false)
    }

    fetchOrders()

    const channel = supabase.channel("admin-orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload: any) => {
      if (payload.eventType === "INSERT") setOrders((prev) => [payload.new as Order,...prev])
      if (payload.eventType === "UPDATE") setOrders((prev) => prev.map((o) => (o.id === payload.new.id? (payload.new as Order) : o)))
    }).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [ok])

  if (!ok) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
          <h1 className="font-bold text-lg">Admin Access</h1>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-black" />
          <button onClick={async () => { if ((isAdmin as any)()) setOk(true) }} className="w-full py-2.5 bg-black text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors">Unlock</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="text-sm text-zinc-500">Adrar Ride V11</div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
            <div className="text-sm text-zinc-500">Total Revenue</div>
            <div className="text-2xl font-bold mt-1">{stats.totalCommission} DZD</div>
            <div className="text-xs text-zinc-400 mt-1">Commission fees</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
            <div className="text-sm text-zinc-500">Today</div>
            <div className="text-2xl font-bold mt-1">{stats.todayCommission} DZD</div>
            <div className="text-xs text-emerald-600 mt-1">Live</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
            <div className="text-sm text-zinc-500">Total Orders</div>
            <div className="text-2xl font-bold mt-1">{stats.totalOrders}</div>
            <div className="text-xs text-zinc-400 mt-1">{stats.pending} pending · {stats.accepted} accepted</div>
          </div>
          <div className="bg-black text-white rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-zinc-400">Completion</div>
            <div className="text-2xl font-bold mt-1">{stats.completed}</div>
            <div className="text-xs text-zinc-400 mt-1">Completed trips</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200">
          <div className="p-4 border-b border-zinc-100 flex justify-between items-center">
            <h2 className="font-semibold">Recent Orders</h2>
            <span className="text-sm text-zinc-500">{orders.length} orders</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-zinc-500 border-b border-zinc-100">
                <tr>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Distance</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Fee</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading && <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Loading orders...</td></tr>}
                {!loading && orders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No orders yet</td></tr>}
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4">{new Date(order.created_at).toLocaleString()}</td>
                    <td className="p-4 font-medium">{order.distance_km} km</td>
                    <td className="p-4 font-medium">{order.price} DZD</td>
                    <td className="p-4 text-emerald-600 font-medium">{order.commission} DZD</td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.status === "pending"? "bg-amber-100 text-amber-700" : order.status === "accepted"? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>{order.status.toUpperCase()}</span></td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.is_night? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"}`}>{order.is_night? "NIGHT" : "DAY"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
