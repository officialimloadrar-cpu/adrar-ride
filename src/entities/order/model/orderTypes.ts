export type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'done' | 'cancelled' | 'delivered'
export type OrderType = 'transport' | 'colis' | 'cargo' | 'rental' | 'makla' | 'souk' | 'heavy' | 'ride' | 'corsa'

export interface Order {
  id: string
  type: OrderType
  distanceKm: number
  price: number
  from: { lat: number; lng: number } | string
  to: { lat: number; lng: number } | string
  status: OrderStatus
  driverId?: string
  driver_id?: string
  from_address?: string
  to_address?: string
  description?: string
  created_at?: string
}