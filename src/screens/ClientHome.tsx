import { SERVICE_COLORS } from "../theme/colors";
import { SERVICES } from "../theme/services.config";

interface Props {
  onSelectService: (id: "corsa" | "colis") => void;
}

export default function ClientHome({ onSelectService }: Props) {
  return (
    <div className="min-h-screen font-[Tajawal] text-zinc-900" dir="rtl" style={{ backgroundColor: SERVICE_COLORS.bg }}>
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <div className="h-9 w-9 rounded-full bg-zinc-100" />
        <h1 className="text-lg font-bold">Home</h1>
        <div className="h-9 w-9 rounded-full bg-zinc-100" />
      </header>

      <main className="space-y-6 p-6">
        <div className="rounded- bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Destination</p>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3">
            <span className="text-zinc-400">📍</span>
            <span className="text-sm text-zinc-400">Select destination</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onSelectService("corsa")} className="rounded- bg-white p-5 text-left shadow-sm transition active:scale-[0.98]" style={{ borderTop: `4px solid ${SERVICES.corsa.color}` }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: SERVICES.corsa.bg }}>
              <span className="text-xl">🚗</span>
            </div>
            <p className="mt-4 font-bold">Corsa</p>
            <p className="text-xs text-zinc-500">Private ride</p>
          </button>

          <button onClick={() => onSelectService("colis")} className="rounded- bg-white p-5 text-left shadow-sm transition active:scale-[0.98]" style={{ borderTop: `4px solid ${SERVICES.colis.color}` }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: SERVICES.colis.bg }}>
              <span className="text-xl">📦</span>
            </div>
            <p className="mt-4 font-bold">Colis</p>
            <p className="text-xs text-zinc-500">Send package</p>
          </button>
        </div>
      </main>
    </div>
  );
}