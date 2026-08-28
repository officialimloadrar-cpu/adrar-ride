import { useEffect, useMemo, useState } from 'react';
import { calculateRide, freezeQuote } from './services/pricingEngine';
import type { RideQuote, RideType, Seats } from './services/pricingEngine';

type Step = 'quote' | 'review' | 'searching';

export default function App() {
  const [step, setStep] = useState<Step>('quote');
  const [distance, setDistance] = useState(146);
  const [type, setType] = useState<RideType>('private');
  const [seats, setSeats] = useState<Seats>(1);
  const [fourth, setFourth] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [quote, setQuote] = useState<RideQuote | null>(null);

  useEffect(() => {
    if (step !== 'quote') return;
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, [step]);

  const distanceOk = distance > 0 && distance <= 500;

  const live = useMemo(() => {
    if (!distanceOk) return null;
    return calculateRide({ distance, type, seats, hour: now.getHours(), addFourthSeat: fourth });
  }, [distance, type, seats, fourth, now, distanceOk]);

  const shown = step === 'quote' ? live : quote;

  const goReview = () => {
    setQuote(freezeQuote({ distance, type, seats, hour: now.getHours(), addFourthSeat: fourth }));
    setStep('review');
  };

  const confirmRide = () => {
    if (!quote) return;
    setStep('searching');
  };

  const backToQuote = () => {
    setQuote(null);
    setStep('quote');
  };

  return (
    <div className="app">
      <div className="shell">
        <div className="card">
          {step === 'quote' && (
            <>
              <div className="tabs">
                <button
                  type="button"
                  className={`tab${type === 'collective' ? ' active' : ''}`}
                  onClick={() => setType('collective')}
                >
                  Collective
                </button>
                <button
                  type="button"
                  className={`tab${type === 'private' ? ' active' : ''}`}
                  onClick={() => setType('private')}
                >
                  Private
                </button>
              </div>

              <label className="label" htmlFor="distance">
                Distance (km)
              </label>
              <input
                id="distance"
                className="field"
                type="number"
                min={1}
                max={500}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
              />

              <div className="row">
                {type === 'collective' ? (
                  <div className="seats">
                    {([1, 2, 3] as Seats[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`seat${seats === s ? ' active' : ''}`}
                        onClick={() => setSeats(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={fourth}
                      onChange={(e) => setFourth(e.target.checked)}
                    />
                    Add 4th Seat +350
                  </label>
                )}
              </div>

              {shown && <PriceBlock ride={shown} />}

              <button
                type="button"
                className="btn"
                disabled={!distanceOk}
                onClick={goReview}
              >
                Continue
              </button>
            </>
          )}

          {step === 'review' && quote && (
            <>
              <h2 style={{ margin: '0 0 16px', fontSize: '1.15rem' }}>Confirm Ride</h2>
              <dl className="summary">
                <div>
                  <dt>Type</dt>
                  <dd>{quote.type === 'private' ? 'Private' : 'Collective'}</dd>
                </div>
                <div>
                  <dt>Distance</dt>
                  <dd>{quote.distance} km</dd>
                </div>
                <div>
                  <dt>Seats</dt>
                  <dd>{quote.seats}</dd>
                </div>
                <div>
                  <dt>Night</dt>
                  <dd>{quote.isNight ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt>You pay</dt>
                  <dd>{quote.finalPrice} DA</dd>
                </div>
                <div>
                  <dt>Driver</dt>
                  <dd>{quote.driverEarning} DA</dd>
                </div>
                <div>
                  <dt>Commission</dt>
                  <dd>{quote.commission} DA</dd>
                </div>
              </dl>
              <PriceBlock ride={quote} locked />
              <button type="button" className="btn" onClick={confirmRide}>
                Confirm Ride
              </button>
              <button type="button" className="btn ghost" onClick={backToQuote}>
                Back
              </button>
            </>
          )}

          {step === 'searching' && quote && (
            <>
              <div className="search">
                <div className="pulse" aria-hidden />
                <h1>Looking for a driver</h1>
                <p>Price is locked at {quote.finalPrice} DA</p>
              </div>
              <PriceBlock ride={quote} locked />
              <button type="button" className="btn ghost" onClick={backToQuote}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PriceBlock({
  ride,
  locked = false,
}: {
  ride: { finalPrice: number; driverEarning: number; isNight: boolean; type: RideType };
  locked?: boolean;
}) {
  return (
    <div className="quote">
      <div className="quote-row">
        <span style={{ opacity: 0.7 }}>{locked ? 'Locked' : 'Final'}</span>
        <span className="price">{ride.finalPrice} DA</span>
      </div>
      <div className="quote-row">
        <span>Driver</span>
        <span>{ride.driverEarning} DA</span>
      </div>
      {ride.isNight && ride.type === 'collective' && <span className="badge">Night x1.25</span>}
    </div>
  );
}
