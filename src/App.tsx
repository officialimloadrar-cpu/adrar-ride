import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { calculateRide, freezeQuote } from "./services/pricingEngine";
import type { RideQuote, RideType, Seats } from "./services/pricingEngine";
import DriverDualMode from "./screens/DriverDualMode";
import DriverDebtScreen from "./screens/DriverDebtScreen";
import AdminSettlements from "./screens/AdminSettlements";
import { SERVICES } from "./theme/services.config";
import { SERVICE_COLORS } from "./theme/colors";

import OrderLightPage from "./pages/order-light";
import OrderFellahPage from "./pages/order-fellah";
import OrdersPage from "./pages/orders";

type Step = "quote" | "review" | "searching";
type DriverView = "dual" | "wallet" | "admin";

function Home() {
  const [isDriver, setIsDriver] = useState(false);
  const [driverView, setDriverView] = useState<DriverView>("dual");
  const [step, setStep] = useState<Step>("quote");
  const [distance, setDistance] = useState(146);
  const [type, setType] = useState<RideType>("private");
  const [seats, setSeats] = useState<Seats>(1);
  const [fourth, setFourth] = useState(false);
  const [vehicle, setVehicle] = useState<"touristique" | "duster" | "hilux" | "fourgon">("touristique");
  const [duration, setDuration] = useState<"half" | "full" | "week" | "month">("full");
  const [now, setNow] = useState(() => new Date());
  const [quote, setQuote] = useState<RideQuote | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(900);

  useEffect(() => {
    if (step!== "quote") return;
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (step!== "searching" ||!quote || quote.seats!== 3) return;
    setSecondsLeft(900);
    const id = setInterval(() => setSecondsLeft((s) => (s <= 1? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [step, quote]);

  const distanceOk = type === "location" || (distance > 0 && distance <= 600);

  const live = useMemo(() => {
    if (!distanceOk) return null;
    try {
      return calculateRide({ distance, type, seats, hour: now.getHours(), addFourthSeat: fourth, vehicle, locationDuration: duration });
    } catch {
      return null;
    }
  }, [distance, type, seats, fourth, now, distanceOk, vehicle, duration]);

  const shown = step === "quote"? live : quote;

  if (isDriver) {
    return (
      <div className="min-h-screen p-4" style={{ backgroundColor: SERVICE_COLORS.bg }}>
        <div className="mx-auto max-w-md">
          <div className="mb-4 flex gap-2">
            <button type="button" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-zinc-900 shadow-sm" onClick={() => setIsDriver(false)}>← Client</button>
            <button type="button" onClick={() => setDriverView("dual")} className="rounded-xl px-4 py-2 text-xs font-bold" style={{ backgroundColor: driverView === "dual"? SERVICES.corsa.color : "#fff", color: driverView === "dual"? "#fff" : "#111827" }}>Rides</button>
            <button type="button" onClick={() => setDriverView("wallet")} className="rounded-xl px-4 py-2 text-xs font-bold" style={{ backgroundColor: driverView === "wallet"? SERVICES.corsa.color : "#fff", color: driverView === "wallet"? "#fff" : "#111827" }}>Wallet</button>
            <button type="button" onClick={() => setDriverView("admin")} className="rounded-xl px-4 py-2 text-xs font-bold" style={{ backgroundColor: driverView === "admin"? SERVICES.corsa.color : "#fff", color: driverView === "admin"? "#fff" : "#111827" }}>Admin</button>
          </div>
          {driverView === "dual" && <DriverDualMode driverId="driver_001" />}
          {driverView === "wallet" && <DriverDebtScreen driverId="driver_001" />}
          {driverView === "admin" && <AdminSettlements />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: SERVICE_COLORS.bg }}>
      <button type="button" className="fixed left-3 top-3 z-50 rounded-xl bg-white px-4 py-2 text-sm font-bold text-zinc-900 shadow-sm" onClick={() => setIsDriver(true)}>Driver Mode</button>
      <div className="mx-auto mt-14 max-w-md rounded- bg-white p-6 shadow-sm">
        {step === "quote" && (
          <>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {(["collective", "private", "location"] as RideType[]).map((t) => (
                <button key={t} type="button" onClick={() => { setType(t); setSeats(1); setFourth(false); }} className="rounded-xl py-2 text-xs font-bold capitalize" style={{ backgroundColor: type === t? SERVICES.corsa.color : "#F4F4F5", color: type === t? "#fff" : "#111827" }}>{t}</button>
              ))}
            </div>
            {type!== "location"? (
              <>
                <input className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none" type="number" min={1} max={600} value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
                <div className="mt-4 flex gap-2">
                  {([1, 2, 3] as Seats[]).map((s) => (
                    <button key={s} type="button" onClick={() => setSeats(s)} className="flex-1 rounded-xl py-2 text-sm font-bold" style={{ backgroundColor: seats === s? SERVICES.corsa.color : "#F4F4F5", color: seats === s? "#fff" : "#111827" }}>{s}</button>
                  ))}
                </div>
                <label className="mt-3 flex items-center gap-2 text-xs font-medium text-zinc-900"><input type="checkbox" checked={fourth} onChange={(e) => setFourth(e.target.checked)} />Add 4th Seat +350</label>
              </>
            ) : (
              <>
                <select className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none" value={vehicle} onChange={(e) => setVehicle(e.target.value as any)}>
                  <option value="touristique">Touristique +2000</option><option value="duster">Duster +2000</option><option value="hilux">Hilux +2000</option><option value="fourgon">Fourgon +2000</option>
                </select>
                <select className="mt-3 w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none" value={duration} onChange={(e) => setDuration(e.target.value as any)}>
                  <option value="half">Half Day</option><option value="full">Full Day</option><option value="week">Week</option><option value="month">Month</option>
                </select>
              </>
            )}
            {shown && <div className="mt-5 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-900"><div className="flex justify-between font-bold"><span>{shown.finalPrice} DA</span><span style={{ color: SERVICES.corsa.color }}>{shown.isNight? "Night" : "Day"}</span></div></div>}
            <button type="button" disabled={!distanceOk ||!shown} onClick={() => { setQuote(freezeQuote({ distance, type, seats, hour: now.getHours(), addFourthSeat: fourth, vehicle, locationDuration: duration })); setStep("review"); }} className="mt-5 w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50" style={{ backgroundColor: SERVICES.corsa.color }}>Continue</button>
            <div className="mt-3 flex gap-2">
              <a href="/order-light" className="flex-1 rounded-xl bg-zinc-100 py-2 text-center text-xs font-bold">Moto</a>
              <a href="/order-fellah" className="flex-1 rounded-xl bg-zinc-100 py-2 text-center text-xs font-bold">Fellah</a>
              <a href="/orders" className="flex-1 rounded-xl bg-zinc-100 py-2 text-center text-xs font-bold">Orders</a>
            </div>
          </>
        )}
        {step === "review" && quote && (
          <>
            <h2 className="mb-4 text-base font-bold text-zinc-900">Confirm Ride</h2>
            <div className="space-y-2 text-sm text-zinc-900"><div className="flex justify-between"><span>Type</span><span>{quote.type}</span></div><div className="flex justify-between"><span>You pay</span><span className="font-bold">{quote.finalPrice} DA</span></div><div className="flex justify-between"><span>Driver</span><span>{quote.driverEarning} DA</span></div></div>
            <button type="button" className="mt-5 w-full rounded-xl py-3 text-sm font-bold text-white" style={{ backgroundColor: SERVICES.corsa.color }} onClick={() => setStep("searching")}>Confirm Ride</button>
            <button type="button" className="mt-2 w-full rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-900" onClick={() => { setQuote(null); setStep("quote"); }}>Back</button>
          </>
        )}
        {step === "searching" && quote && (
          <>
            <div className="text-center text-zinc-900"><h1 className="font-bold">Looking for driver</h1><p className="mt-2 text-sm">Locked at {quote.finalPrice} DA</p>{quote.seats === 3 && <p className="mt-2 text-xs">{Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")} {secondsLeft === 0? "→ Depart with 3" : ""}</p>}</div>
            <button type="button" className="mt-5 w-full rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-900" onClick={() => { setQuote(null); setStep("quote"); }}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/order-light", element: <OrderLightPage /> },
  { path: "/order-fellah", element: <OrderFellahPage /> },
  { path: "/orders", element: <OrdersPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}