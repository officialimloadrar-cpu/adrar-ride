import { useEffect, useState } from 'react'
import { MapPlaceholder } from '@/shared/ui/Map'
export function MapView() {
  const [pos, setPos] = useState<{lat:number,lng:number}|null>(null)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }), () => {}, { enableHighAccuracy: true })
  }, [])
  if (!pos) return <div className="h-64 flex items-center justify-center">GPS required - Enable location to prevent fraud</div>
  return <MapPlaceholder lat={pos.lat} lng={pos.lng} />
}
