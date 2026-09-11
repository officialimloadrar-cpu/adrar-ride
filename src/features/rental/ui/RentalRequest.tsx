import { useState, useMemo } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/Input'

const colors = {
  bg: '#FFF9C4',
  primary: '#FFEB3B',
  light: '#FDE68A',
  text: '#000000',
  icon: '🚙',
  label: 'كراء السيارات'
}

type Car = {
  id: string
  name: string
  owner: string
  image: string
  pricePerDay: number
}

const cars: Car[] = [
  { id: '1', name: 'Toyota Corolla', owner: 'أحمد - أدرار', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200', pricePerDay: 3500 },
  { id: '2', name: 'Dacia Logan', owner: 'يوسف - وهران', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200', pricePerDay: 3000 },
  { id: '3', name: 'Hyundai Accent', owner: 'كريم - أدرار', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200', pricePerDay: 4000 },
]

function ColoredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 p-6 rounded-2xl border-2 shadow-sm" style={{ background: colors.bg, borderColor: colors.light }}>
      {children}
    </div>
  )
}

export function RentalRequest() {
  const [place, setPlace] = useState("")
  const [car, setCar] = useState<Car | null>(null)
  const [show, setShow] = useState(false)
  const [days, setDays] = useState(1)
  const total = useMemo(() => car ? car.pricePerDay * days : 0, [car, days])

  return (
    <ColoredCard>
      <div className="flex justify-between items-center">
        <h2 className="font-bold flex gap-2 text-lg" style={{ color: colors.text }}>
          {colors.icon} {colors.label}
        </h2>
        {car && <span className="font-black text-xl" style={{ color: colors.text }}>{total} دج</span>}
      </div>

      <Input placeholder="مكان الاستلام" value={place} onChange={e => setPlace(e.target.value)} />

      <div className="relative">
        <button onClick={() => setShow(!show)} className="w-full p-3 border-2 rounded-xl bg-white text-right font-bold flex justify-between items-center" style={{ borderColor: colors.light, color: '#000' }}>
          <span>{car ? `${car.name} - ${car.owner}` : 'اختر نوع السيارة'}</span>
          <span>▼</span>
        </button>
        {show && (
          <div className="absolute z-10 w-full bg-white border-2 rounded-xl shadow-lg mt-2 overflow-hidden" style={{ borderColor: colors.light }}>
            {cars.map(c => (
              <button key={c.id} onClick={() => { setCar(c); setShow(false) }} className="w-full flex gap-3 p-3 text-right border-b hover:bg-yellow-50">
                <img src={c.image} className="w-16 h-12 rounded-lg object-cover" alt="" />
                <div>
                  <div className="font-bold text-sm text-black">{c.name}</div>
                  <div className="text-xs text-zinc-600">{c.owner} - {c.pricePerDay} دج/يوم</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Input type="number" min={1} value={days} onChange={e => setDays(Number(e.target.value))} placeholder="عدد الأيام" />

      <Button className="w-full h-12 font-black text-black border-2" style={{ backgroundColor: colors.primary, borderColor: colors.light }}>
        {car ? `احجز الآن - ${total} دج` : 'اختر السيارة أولا'}
      </Button>
    </ColoredCard>
  )
}

export default RentalRequest
