import { SERVICE_COLORS } from "../theme/colors";
import { SERVICES, type ServiceId } from "../theme/services.config";

interface Order {
  origin: string;
  dest: string;
  distance: number;
  total: number;
  status: "pending" | "accepted" | "on_trip" | "completed";
  driverName?: string;
}

interface Props {
  serviceId: ServiceId;
  order: Order;
  pricing?: { base: number; finalPrice: number; commission: number };
}

export default function TripTracking({ serviceId, order, pricing }: Props) {
  const service = SERVICES[serviceId];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: SERVICE_COLORS.bg }}>
      <div className="mx-auto max-w-md space-y-5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: service.color }} />
          <h1 className="text-lg font-bold capitalize">{serviceId} Tracking</h1>
        </div>

        <div className="rounded- bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold">{order.origin} → {order.dest}</p>
          <p className="mt-1 text-xs text-zinc-500">{order.distance} km • {order.status}</p>
          {order.driverName && <p className="mt-3 text-sm">Driver: <span className="font-bold">{order.driverName}</span></p>}
        </div>

        <div className="rounded- bg-white p-5 shadow-sm">
          <div className="flex justify-between text-sm"><span>Base</span><span>{pricing?.base?? order.total} DZD</span></div>
          <div className="flex justify-between text-sm text-zinc-500"><span>Commission</span><span>{pricing?.commission?? 0} DZD</span></div>
          <div className="mt-2 flex justify-between border-t pt-3 text-sm font-bold"><span>Total</span><span>{pricing?.finalPrice?? order.total} DZD</span></div>
        </div>

        <div className="h-48 rounded- bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">Map View</div>

        <div className="flex gap-2">
          <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: order.status!== "pending"? service.color : "#E4E7" }} />
          <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: order.status === "on_trip" || order.status === "completed"? service.color : "#E4E4E7" }} />
          <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: order.status === "completed"? service.color : "#E4E4E7" }} />
        </div>
      </div>
    </div>
  );
}