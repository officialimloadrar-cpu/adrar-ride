
import { useState,useCallback } from 'react'
export function useGeolocation(){
  const [pos,setPos]=useState<{lat:number,lng:number}|null>(null)
  const [loading,setLoading]=useState(false)
  const refresh=useCallback(()=>{ setLoading(true); if(!navigator.geolocation){ setPos({lat:27.87,lng:-0.28}); setLoading(false); return } navigator.geolocation.getCurrentPosition(p=>{ setPos({lat:p.coords.latitude,lng:p.coords.longitude}); setLoading(false)},()=>{ setPos({lat:27.87,lng:-0.28}); setLoading(false)}) },[])
  return { pos, loading, refresh }
}
