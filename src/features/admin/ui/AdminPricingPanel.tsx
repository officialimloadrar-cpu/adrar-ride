import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/shared/lib/supabase"
import { Card } from "@/shared/ui/Card"
import { Button } from "@/shared/ui/button"

type ServiceType = "ride" | "colis" | "cargo" | "rental" | "makla"

interface Pricing {
  id: string
  service: ServiceType
  base_price: number
  night_price: number | null
  per_km: number
  created_at: string
}

type PricingField = "base_price" | "night_price" | "per_km"

const SERVICE_TYPES: ServiceType[] = ["ride", "colis", "cargo", "rental", "makla"]

const DEFAULT_PRICING: Record<ServiceType, Omit<Pricing, "id" | "created_at">> = {
  ride: { service: "ride", base_price: 300, night_price: 450, per_km: 30 },
  colis: { service: "colis", base_price: 200, night_price: null, per_km: 30 },
  cargo: { service: "cargo", base_price: 200, night_price: null, per_km: 30 },
  rental: { service: "rental", base_price: 200, night_price: null, per_km: 30 },
  makla: { service: "makla", base_price: 200, night_price: null, per_km: 30 },
}

export function AdminPricingPanel() {
  const [pricings, setPricings] = useState<Pricing[]>([])
  const [loading, setLoading] = useState(true)

  const pricingMap = useMemo(() => {
    return new Map(pricings.map((p) => [p.service, p]))
  }, [pricings])

  const fetchPricings = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from("pricing").select("*").order("service")
    if (!error && data) {
      setPricings(data as Pricing[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPricings()
  }, [fetchPricings])

  const handleUpdate = useCallback(async (id: string, field: PricingField, value: number) => {
    const { error } = await supabase.from("pricing").update({ [field]: value }).eq("id", id)
    if (!error) {
      setPricings((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    }
  }, [])

  const handleInitialize = useCallback(async () => {
    const missing = SERVICE_TYPES.filter((s) => !pricingMap.has(s))
    if (missing.length === 0) return

    const payload = missing.map((service) => DEFAULT_PRICING[service])
    const { error } = await supabase.from("pricing").insert(payload)
    if (!error) {
      await fetchPricings()
    }
  }, [pricingMap, fetchPricings])

  if (loading) {
    return <div className="p-6 text-sm text-zinc-500">Loading</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Pricing</h1>
        <Button onClick={handleInitialize}>Initialize</Button>
      </div>

      <div className="grid gap-4">
        {SERVICE_TYPES.map((service) => {
          const pricing = pricingMap.get(service)

          if (!pricing) {
            return (
              <Card key={service} className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{service}</span>
                  <span className="text-xs text-zinc-400">Not configured</span>
                </div>
              </Card>
            )
          }

          return (
            <Card key={service} className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold capitalize">{service}</span>
                {service === "ride" && <span className="text-xs text-zinc-500">Night rate 20:00 - 06:00</span>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">Base Price</label>
                  <input
                    type="number"
                    value={pricing.base_price}
                    onChange={(e) => handleUpdate(pricing.id, "base_price", Number(e.target.value))}
                    className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">Per KM</label>
                  <input
                    type="number"
                    value={pricing.per_km}
                    onChange={(e) => handleUpdate(pricing.id, "per_km", Number(e.target.value))}
                    className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                  />
                </div>

                {service === "ride" && (
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500">Night Price</label>
                    <input
                      type="number"
                      value={pricing.night_price ?? 0}
                      onChange={(e) => handleUpdate(pricing.id, "night_price", Number(e.target.value))}
                      className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                    />
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}