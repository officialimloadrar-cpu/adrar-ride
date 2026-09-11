import { useState } from 'react'
import { getPriceBreakdown, cargoPrice } from '@/services/pricingEngine'
import { Card } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'

export function PriceCalculator() {
  const [d, setD] = useState(146)
  const b = getPriceBreakdown({ mode: 'standard', distanceKm: d })
  return (
    <Card className="space-y-2">
      <Input type="number" value={d} onChange={(e) => setD(Number(e.target.value))} />
      <div>Prive3 {b.p3Day}/{b.p3Night} - Prive4 {b.p4Day}/{b.p4Night}</div>
      <div>Cargo Hilux {cargoPrice(d,'hilux')} Fourgon {cargoPrice(d,'fourgon_short')}</div>
    </Card>
  )
}