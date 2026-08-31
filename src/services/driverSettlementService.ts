
import { supabase } from './supabase'
export type SettlementMethod='cash'|'bank'|'mobile'
export async function getUnpaidTotal(driverId:string){ if(!supabase) return 0; const {data}=await supabase.from('debts').select('amount').eq('driver_id',driverId); return (data||[]).reduce((s:any,r:any)=>s+(r.amount||0),0) }
export async function createSettlement(driverId:string,amount:number,method:SettlementMethod){ if(!supabase) return null; const {data}=await supabase.from('debts').insert({driver_id:driverId,amount:-Math.abs(amount),reason:`settlement ${method}`}).select().single(); return data }
