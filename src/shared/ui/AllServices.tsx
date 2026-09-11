export const serviceColors = {
  ride: { bg: '#E8F5E9', primary: '#2E7D32', light: '#4CAF50', icon: '🚕', label: 'تنقلات', sub: 'نقل الأشخاص' },
  colis: { bg: '#FFF3E0', primary: '#EF6C00', light: '#FF9800', icon: '📦', label: 'نقل الطرود', sub: 'طرود صغيرة' },
  cargo: { bg: '#F3E5F5', primary: '#6A1B9A', light: '#9C27B0', icon: '🚚', label: 'الشحن', sub: 'طرود كبيرة' },
  rental: { bg: '#FFF9C4', primary: '#FACC15', light: '#FDE68A', icon: '🚙', label: 'كراء', sub: 'كراء سيارة مع سائق' },
  makla: { bg: '#FFEBEE', primary: '#C62828', light: '#F44336', icon: '🍔', label: 'مأكولات', sub: 'توصيل الطعام' },
}

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/Input'
import { supabase } from '@/shared/lib/supabase'
import { getIsNight, getPricing } from '@/shared/lib/shift'

function estimateDistanceKm(a: string, b: string) {
  if (!a ||!b) return 0
  if (a.trim() === b.trim()) return 3
  const seed = (a + b).split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  return 5 + (seed % 15)
}

type ServiceType = 'group' | 'prive_3' | 'prive_4' | null

function ColoredCard({ bg, borderColor, children }: { bg: string; borderColor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 p-6 rounded-2xl border-2 shadow-sm" style={{ background: bg, borderColor }}>
      {children}
    </div>
  )
}

export function RideRequestGreen() {
  const colors = serviceColors.ride
  const [fromAddress, setFromAddress] = useState("")
  const [toAddress, setToAddress] = useState("")
  const [distance, setDistance] = useState(0)
  const [selected, setSelected] = useState<ServiceType>(null)
  const [loading, setLoading] = useState(false)
  const isNight = getIsNight()
  const groupPricing = getPricing('group', isNight)
  const privePricing = getPricing('prive', isNight)
  useEffect(() => { if (fromAddress && toAddress) setDistance(estimateDistanceKm(fromAddress, toAddress)); else setDistance(0) }, [fromAddress, toAddress])
  const prices = useMemo(() => ({ group: Math.round(groupPricing.price + distance * 15), prive_3: Math.round(privePricing.price + distance * 20), prive_4: Math.round(privePricing.price * 1.2 + distance * 20) }), [groupPricing.price, privePricing.price, distance])
  const isValid = fromAddress.trim() && toAddress.trim() && distance > 0 && selected
  const handleRequest = useCallback(async () => {
    if (!isValid ||!selected) return
    setLoading(true)
    await supabase.from('orders').insert({ type: 'ride', sub_type: selected, from_address: fromAddress, to_address: toAddress, distance_km: distance, price: prices[selected!], status: 'pending' })
    setLoading(false)
  }, [isValid, selected, fromAddress, toAddress, distance, prices])
  return (
    <ColoredCard bg={colors.bg} borderColor={colors.light}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold flex gap-2 items-center" style={{ color: colors.primary }}>{colors.icon} {colors.label}</h2>
        {selected && distance > 0 && <span className="text-xl font-black" style={{ color: colors.primary }}>{prices[selected]} دج</span>}
      </div>
      <Input placeholder="من أين - نقطة الانطلاق" value={fromAddress} onChange={e => setFromAddress(e.target.value)} />
      <Input placeholder="إلى أين - الوجهة" value={toAddress} onChange={e => setToAddress(e.target.value)} />
      {distance > 0 && <p className="text-xs font-bold" style={{ color: colors.primary }}>{distance} كم - محسوب تلقائيا</p>}
      <div className="grid grid-cols-3 gap-3">
        {(['group','prive_3','prive_4'] as ServiceType[]).map(s => (
          <button key={s} onClick={() => setSelected(s)} className="p-3 rounded-xl border-2 text-sm font-bold" style={{ background: selected===s?colors.primary:'white', color: selected===s?'white':colors.primary, borderColor: colors.primary }}>
            {s==='group'?'جماعي': s==='prive_3'?'خاص 3':'خاص 4'}
            {distance>0 && <div className="text-xs mt-1">{prices[s!]} دج</div>}
          </button>
        ))}
      </div>
      <Button onClick={handleRequest} disabled={!isValid || loading} className="w-full h-12 font-bold text-white" style={{ backgroundColor: colors.primary }}>{loading?'جاري...': selected? `طلب - ${prices[selected!]} دج` : 'اختر الخدمة'}</Button>
    </ColoredCard>
  )
}

type Restaurant = { id: string; name: string; owner: string; image: string; address: string }
const restaurants: Restaurant[] = [
  { id: '1', name: 'مطعم السلام', owner: 'أحمد', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200', address: 'وسط المدينة' },
  { id: '2', name: 'بيتزا هت', owner: 'محمد', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200', address: 'تيليلان' },
]

export function MaklaRequestRed() {
  const colors = serviceColors.makla
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [show, setShow] = useState(false)
  const [items, setItems] = useState("")
  const [distance, setDistance] = useState(0)
  const [loading, setLoading] = useState(false)
  useEffect(() => { if (deliveryAddress && selectedRestaurant) setDistance(estimateDistanceKm(deliveryAddress, selectedRestaurant.address)); else setDistance(0) }, [deliveryAddress, selectedRestaurant])
  const price = useMemo(() => distance===0?0: distance<=5?250:250+(distance-5)*30, [distance])
  const isValid = deliveryAddress.trim() && selectedRestaurant && items.trim()
  return (
    <ColoredCard bg={colors.bg} borderColor={colors.light}>
      <div className="flex justify-between"><h2 className="font-bold flex gap-2" style={{ color: colors.primary }}>{colors.icon} {colors.label}</h2>{distance>0 && <span className="font-black" style={{ color: colors.primary }}>{price} دج - {distance} كم</span>}</div>
      <Input placeholder="عنوان التوصيل" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
      <div className="relative">
        <button onClick={()=>setShow(!show)} className="w-full p-3 border-2 rounded-xl bg-white text-right font-bold" style={{ borderColor: colors.primary, color: colors.primary }}>{selectedRestaurant?selectedRestaurant.name:'اختر المطعم - قائمة تلقائية'}</button>
        {show && <div className="absolute z-10 mt-2 w-full bg-white border-2 rounded-xl shadow-lg" style={{ borderColor: colors.light }}>{restaurants.map(r=>(
          <button key={r.id} onClick={()=>{setSelectedRestaurant(r); setShow(false)}} className="w-full flex gap-3 p-3 hover:bg-red-50 text-right border-b"><img src={r.image} className="w-16 h-12 rounded-lg object-cover" alt=""/><div><div className="font-bold text-sm">{r.name}</div><div className="text-xs text-zinc-500">{r.owner}</div></div></button>
        ))}</div>}
      </div>
      <Input placeholder="الطلبات" value={items} onChange={e=>setItems(e.target.value)} />
      <Button disabled={!isValid || loading} className="w-full h-12 font-bold text-white" style={{ backgroundColor: colors.primary }}>{isValid?`اطلب الآن - ${price} دج`:'اختر المطعم'}</Button>
    </ColoredCard>
  )
}

type Car = { id: string; name: string; owner: string; image: string; pricePerDay: number }
const cars: Car[] = [
  { id: '1', name: 'Toyota Corolla', owner: 'أحمد - أدرار', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200', pricePerDay: 3500 },
  { id: '2', name: 'Dacia Logan', owner: 'يوسف', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200', pricePerDay: 3000 },
]

export function RentalRequestYellow() {
  const colors = serviceColors.rental
  const [place, setPlace] = useState("")
  const [car, setCar] = useState<Car | null>(null)
  const [show, setShow] = useState(false)
  const [days, setDays] = useState(1)
  const total = useMemo(()=> car?car.pricePerDay*days:0, [car, days])
  return (
    <ColoredCard bg={colors.bg} borderColor={colors.light}>
      <div className="flex justify-between"><h2 className="font-bold flex gap-2 text-black">{colors.icon} {colors.label}</h2>{car && <span className="font-black text-black">{total} دج</span>}</div>
      <Input placeholder="مكان الاستلام" value={place} onChange={e=>setPlace(e.target.value)} />
      <div className="relative">
        <button onClick={()=>setShow(!show)} className="w-full p-3 border-2 rounded-xl bg-white text-right font-bold text-black" style={{ borderColor: colors.light }}>{car?`${car.name} - ${car.owner}`:'اختر نوع السيارة'}</button>
        {show && <div className="absolute z-10 w-full bg-white border-2 rounded-xl shadow-lg mt-2" style={{ borderColor: colors.light }}>{cars.map(c=>(
          <button key={c.id} onClick={()=>{setCar(c); setShow(false)}} className="w-full flex gap-3 p-3 text-right border-b"><img src={c.image} className="w-16 h-12 rounded-lg object-cover" alt=""/><div><div className="font-bold text-sm text-black">{c.name}</div><div className="text-xs text-zinc-600">{c.owner} - {c.pricePerDay} دج/يوم</div></div></button>
        ))}</div>}
      </div>
      <Input type="number" min={1} value={days} onChange={e=>setDays(Number(e.target.value))} />
      <Button className="w-full h-12 font-black text-black border-2" style={{ backgroundColor: colors.primary, borderColor: colors.light }}>{car?`احجز - ${total} دج`:'اختر السيارة'}</Button>
    </ColoredCard>
  )
}

export function ColisRequestOrange() {
  const colors = serviceColors.colis
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [distance, setDistance] = useState(0)
  useEffect(()=>{ if(from&&to) setDistance(estimateDistanceKm(from,to)); else setDistance(0)},[from,to])
  const price = useMemo(()=> distance===0?0: 300+distance*25, [distance])
  return (
    <ColoredCard bg={colors.bg} borderColor={colors.light}>
      <div className="flex justify-between"><h2 className="font-bold flex gap-2" style={{ color: colors.primary }}>{colors.icon} {colors.label}</h2>{distance>0 && <span className="font-black" style={{ color: colors.primary }}>{price} دج</span>}</div>
      <Input placeholder="تحديد مكان الإننطلاق" value={from} onChange={e=>setFrom(e.target.value)} />
      <Input placeholder="الوجهة" value={to} onChange={e=>setTo(e.target.value)} />
      {distance>0 && <p className="text-xs font-bold" style={{ color: colors.primary }}>{distance} كم</p>}
      <Button className="w-full h-12 font-bold text-white" style={{ backgroundColor: colors.primary }}>{distance>0?`إرسال طرد - ${price} دج`:'اختر الوجهة'}</Button>
    </ColoredCard>
  )
}

export function CargoRequestPurple() {
  const colors = serviceColors.cargo
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [distance, setDistance] = useState(0)
  useEffect(()=>{ if(from&&to) setDistance(estimateDistanceKm(from,to)); else setDistance(0)},[from,to])
  const price = useMemo(()=> distance===0?0: 600+distance*40, [distance])
  return (
    <ColoredCard bg={colors.bg} borderColor={colors.light}>
      <div className="flex justify-between"><h2 className="font-bold flex gap-2" style={{ color: colors.primary }}>{colors.icon} {colors.label}</h2>{distance>0 && <span className="font-black" style={{ color: colors.primary }}>{price} دج</span>}</div>
      <Input placeholder="تحديد مكان الإنطلاق" value={from} onChange={e=>setFrom(e.target.value)} />
      <Input placeholder="الوجهة" value={to} onChange={e=>setTo(e.target.value)} />
      {distance>0 && <p className="text-xs font-bold" style={{ color: colors.primary }}>{distance} كم</p>}
      <Button className="w-full h-12 font-bold text-white" style={{ backgroundColor: colors.primary }}>{distance>0?`شحن ثقيل - ${price} دج`:'اختر الوجهة'}</Button>
    </ColoredCard>
  )
}