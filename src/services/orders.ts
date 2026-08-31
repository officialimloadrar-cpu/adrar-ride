
import { supabase } from './supabase'
export type OrderType='transport'|'colis'
export async function createOrder(payload:any){ if(!supabase) throw new Error('supabase not configured'); const {data,error}=await supabase.from('orders').insert(payload).select().single(); if(error) throw error; return data }
export async function listOrders(limit=50){ if(!supabase) return []; const {data}=await supabase.from('orders').select('*').order('created_at',{ascending:false}).limit(limit); return data||[] }
export async function updateOrderStatus(id:string,status:string){ if(!supabase) return null; const {data}=await supabase.from('orders').update({status}).eq('id',id).select().single(); return data }
