import { useEffect, useMemo, useState } from "react";
import { calculateRide, freezeQuote } from "./services/pricingEngine";
import type { RideQuote, RideType, Seats } from "./services/pricingEngine";
import DriverColis from "./screens/DriverColis";

type Step = "quote" | "review" | "searching";

export default function App() {
  const [isDriver, setIsDriver] = useState(false);
  const [step, setStep] = useState<Step>("quote");
  const [distance, setDistance] = useState(146);
  const [type, setType] = useState<RideType>("private");
  const [seats, setSeats] = useState<Seats>(1);
  const [fourth, setFourth] = useState(false);
  const [vehicle, setVehicle] = useState<"touristique" | "duster" | "hilux" | "fourgon">("touristique");
  const [duration, setDuration] = useState<"half" | "full" | "week" | "month">("full");
  const [now, setNow] = useState(() => new Date());
  const [quote, setQuote] = useState<RideQuote | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    if (step!== "quote") return;
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (step!== "searching" ||!quote || quote.seats!== 3) return;
    setSecondsLeft(15 * 60);
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

  const goReview = () => {
    setQuote(freezeQuote({ distance, type, seats, hour: now.getHours(), addFourthSeat: fourth, vehicle, locationDuration: duration }));
    setStep("review");
  };

  const confirmRide = () => {
    if (!quote) return;
    setStep("searching");
  };

  const backToQuote = () => {
    setQuote(null);
    setStep("quote");
  };

  if (isDriver) {
    return (
      <div className="app">
        <div className="shell">
          <button type="button" className="btn ghost" onClick={() => setIsDriver(false)}>← Client</button>
          <DriverColis driverId="driver_001" />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <button type="button" className="btn ghost" style={{ position: "fixed", top: 12, left: 12, zIndex: 50 }} onClick={() => setIsDriver(true)}>Driver Mode</button>
      <div className="shell">
        <div className="card">
          {step === "quote" && (
            <>
              <div className="tabs">
                <button type="button" className={`tab${type === "collective"? " active" : ""}`} onClick={() => { setType("collective"); setSeats(1); setFourth(false); }}>Collective</button>
                <button type="button" className={`tab${type === "private"? " active" : ""}`} onClick={() => { setType("private"); setSeats(1); setFourth(false); }}>Private</button>
                <button type="button" className={`tab${type === "location"? " active" : ""}`} onClick={() => setType("location")}>Location + Chauffeur</button>
              </div>
              {type!== "location"? (
                <>
                  <label className="label" htmlFor="distance">Distance (km)</label>
                  <input id="distance" className="field" type="number" min={1} max={600} value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
                  <div className="row">
                    {type === "collective"? (
                      <>
                        <div className="seats">
                          {([1, 2, 3] as Seats[]).map((s) => (
                            <button key={s} type="button" className={`seat${seats === s? " active" : ""}`} onClick={() => setSeats(s)}>{s}{s === 3? " → 15min" : ""}</button>
                          ))}
                        </div>
                        {seats === 3 && <label className="check"><input type="checkbox" checked={fourth} onChange={(e) => setFourth(e.target.checked)} />Add 4th Seat Family +350</label>}
                      </>
                    ) : <label className="check"><input type="checkbox" checked={fourth} onChange={(e) => setFourth(e.target.checked)} />Add 4th Seat +350</label>}
                  </div>
                </>
              ) : (
                <>
                  <label className="label">Vehicule</label>
                  <select className="field" value={vehicle} onChange={(e) => setVehicle(e.target.value as any)}>
                    <option value="touristique">Touristique +2000 chauffeur</option>
                    <option value="duster">Duster +2000 chauffeur</option>
                    <option value="hilux">Hilux +2000 chauffeur</option>
                    <option value="fourgon">Fourgon +2000 chauffeur</option>
                  </select>
                  <label className="label">Duree</label>
                  <select className="field" value={duration} onChange={(e) => setDuration(e.target.value as any)}>
                    <option value="half">Demi journee</option>
                    <option value="full">Journee complete</option>
                    <option value="week">Semaine</option>
                    <option value="month">Mois</option>
                  </select>
                </>
              )}
              {shown && <PriceBlock ride={shown} distance={type === "location"? 0 : distance} />}
              <button type="button" className="btn" disabled={!distanceOk ||!shown} onClick={goReview}>Continue</button>
            </>
          )}
          {step === "review" && quote && (
            <>
              <h2 style={{ margin: "0 0 16px", fontSize: "1.15rem" }}>Confirm Ride</h2>
              <dl className="summary">
                <div><dt>Type</dt><dd>{quote.type}</dd></div>
                <div><dt>Distance</dt><dd>{quote.distance} km</dd></div>
                <div><dt>Seats</dt><dd>{quote.seats}</dd></div>
                <div><dt>You pay</dt><dd>{quote.finalPrice} DA</dd></div>
                <div><dt>Driver</dt><dd>{quote.driverEarning} DA</dd></div>
              </dl>
              <PriceBlock ride={quote} distance={quote.distance} locked />
              <button type="button" className="btn" onClick={confirmRide}>Confirm Ride</button>
              <button type="button" className="btn ghost" onClick={backToQuote}>Back</button>
            </>
          )}
          {step === "searching" && quote && (
            <>
              <div className="search">
                <div className="pulse" />
                <h1>Looking for a driver</h1>
                <p>Price is locked at {quote.finalPrice} DA</p>
                {quote.seats === 3 && (
                  <p style={{ marginTop: 10, fontSize: "0.9rem" }}>
                    ⏱ {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")} {secondsLeft === 0? "→ Depart avec 3" : ""}
                  </p>
                )}
              </div>
              <PriceBlock ride={quote} distance={quote.distance} locked />
              <button type="button" className="btn ghost" onClick={backToQuote}>Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PriceBlock({ ride, distance, locked = false }: { ride: { finalPrice: number; driverEarning: number; commission: number; isNight: boolean; type: RideType; seats: number }; distance: number; locked?: boolean }) {
  return (
    <div className="quote">
      <div className="quote-row"><span style={{ opacity: 0.7 }}>{locked? "Locked" : "Final"}</span><span className="price">{ride.finalPrice} DA</span></div>
      <div className="quote-row"><span>Driver</span><span>{ride.driverEarning} DA</span></div>
      <div className="quote-row"><span>Commission {distance <= 10 && ride.type!== "location" && distance > 0? "13%" : "15%"}</span><span>{ride.commission} DA</span></div>
    </div>
  );
}