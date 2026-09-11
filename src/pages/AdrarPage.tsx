import { useState } from "react"
import { RideRequest } from "@/features/ride/ui/RideRequest"
import { ColisRequest } from "@/features/colis/ui/ColisRequest"
import { CargoRequest } from "@/features/cargo/ui/CargoRequest"
import { RentalRequest } from "@/features/rental/ui/RentalRequest"
import { MaklaRequest } from "@/features/makla/ui/MaklaRequest"

type ServiceType = "ride" | "colis" | "cargo" | "rental" | "makla"

const SERVICES: { id: ServiceType; label: string }[] = [
  { id: "ride", label: "Ride" },
  { id: "colis", label: "Colis" },
  { id: "cargo", label: "Cargo" },
  { id: "rental", label: "Rental" },
  { id: "makla", label: "Makla" }
]

export function AdrarPage() {
  const [activeService, setActiveService] = useState<ServiceType>("ride")

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="grid grid-cols-5 gap-2">
        {SERVICES.map((service) => (
          <button
            key={service.id}
            onClick={() => setActiveService(service.id)}
            className={`p-2 rounded-lg text-xs font-medium transition-colors ${
              activeService === service.id ? "bg-black text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {service.label}
          </button>
        ))}
      </div>
      <div>
        {activeService === "ride" && <RideRequest />}
        {activeService === "colis" && <ColisRequest />}
        {activeService === "cargo" && <CargoRequest />}
        {activeService === "rental" && <RentalRequest />}
        {activeService === "makla" && <MaklaRequest />}
      </div>
    </div>
  )
}
