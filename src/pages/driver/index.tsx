import { DriverDashboard } from "@/features/driver/ui/DriverDashboard"

export default function DriverPage() {
  const driverId = "current-driver-id"

  return <DriverDashboard driverId={driverId} />
}
