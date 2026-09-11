import { useState } from "react"
import { supabase } from "@/shared/lib/supabase"
import { Card } from "@/shared/ui/Card"
import { Button } from "@/shared/ui/button"
import { useTranslation } from "react-i18next"

type ServiceType = "ride" | "colis" | "cargo" | "rental" | "makla"

interface Props {
  driverId: string
  onComplete: () => void
}

const SERVICES: { id: ServiceType; descKey: string }[] = [
  { id: "ride", descKey: "desc_ride" },
  { id: "colis", descKey: "desc_colis" },
  { id: "cargo", descKey: "desc_cargo" },
  { id: "rental", descKey: "desc_rental" },
  { id: "makla", descKey: "desc_makla" },
]

export function DriverServiceSelection({ driverId, onComplete }: Props) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<ServiceType[]>([])
  const [saving, setSaving] = useState(false)

  const toggle = (service: ServiceType) => {
    setSelected((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  const handleContinue = async () => {
    if (selected.length === 0) return
    setSaving(true)
    const { error } = await supabase.from("drivers").update({ services: selected }).eq("id", driverId)
    setSaving(false)
    if (!error) onComplete()
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{t("select_services")}</h2>
        <p className="text-sm text-zinc-500">{t("choose_services_desc")}</p>
      </div>

      <div className="space-y-2">
        {SERVICES.map((s) => {
          const active = selected.includes(s.id)
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`w-full text-left p-4 rounded-xl border transition ${active ? "border-black bg-zinc-900 text-white" : "border-zinc-200 bg-white"}`}
            >
              <div className="font-medium">{t(s.id)}</div>
              <div className={`text-xs mt-0.5 ${active ? "text-zinc-300" : "text-zinc-500"}`}>{t(s.descKey)}</div>
            </button>
          )
        })}
      </div>

      <Button onClick={handleContinue} disabled={selected.length === 0 || saving} className="w-full h-12 rounded-xl bg-black text-white disabled:opacity-50">
        {saving ? t("saving") : `${t("continue_with")} ${selected.length} ${t("services")}`}
      </Button>
    </div>
  )
}