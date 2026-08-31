export type OrderStatus = "pending" | "accepted" | "delivered";
export interface TransportOrder {
  id: string;
  distance: number;
  seats: number;
  total: number;
  platform: number;
  driver_amount: number;
  status: OrderStatus;
  driver_id: string | null;
  created_at: string;
}
export interface ColisOrder {
  id: string;
  service_type: string;
  distance: number;
  total: number;
  status: OrderStatus;
  driver_id: string | null;
  created_at: string;
}