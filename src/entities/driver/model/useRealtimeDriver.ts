import { useEffect, useState } from 'react'
import { supabase } from '@/shared/lib/supabase'
export function useRealtimeDriver(driverId: string) {
  const [data, setData] = useState<any>(null)
  useEffect(() => {
    const ch = supabase.channel(`driver-${driverId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'driver_debts', filter: `driver_id=eq.${driverId}` }, (p: any) => setData(p.new)).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [driverId])
  return data
}

