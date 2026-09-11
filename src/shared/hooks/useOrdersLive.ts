import { useEffect, useState } from 'react'
import { supabase } from '@/shared/lib/supabase'

export function useOrdersLive() {
  const [orders, setOrders] = useState<any[]>([])
  useEffect(() => {
    supabase.from('orders').select('*').eq('status','pending').order('created_at',{ascending:false}).then((r: any)=> setOrders(r.data||[]))
    const ch = supabase.channel('orders-live')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (p: any) => {
        if(p.new.status==='pending') setOrders(o=>[p.new,...o])
      })
    .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])
  return orders
}

export function useOrderStatus(orderId: string | null) {
  const [order, setOrder] = useState<any>(null)
  useEffect(() => {
    if(!orderId) return
    supabase.from('orders').select('*').eq('id', orderId).single().then((r: any) => setOrder(r.data))
    const ch = supabase.channel(`order-${orderId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (p: any) => {
        setOrder(p.new)
      })
    .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [orderId])
  return order
}