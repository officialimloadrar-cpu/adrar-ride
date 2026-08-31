import { useState,useEffect } from "react";
import { supabase } from "@/shared/lib/api/supabase";
export const useDriverDebt=(driverId?:string)=>{
  const [debt,setDebt]=useState(0);
  const [rows,setRows]=useState<any[]>([]);
  useEffect(()=>{
    if(!supabase) return;
    const load=async()=>{
      let q=supabase.from("debts").select("amount,driver_id,created_at");
      if(driverId) q=q.eq("driver_id",driverId);
      const {data}=await q;
      const list=(data||[]) as any[];
      setRows(list);
      setDebt(list.reduce((s:number,r:any)=> s+Number(r.amount||0),0));
    };
    load();
  },[driverId]);
  return {debt,rows};
};
