import { useEffect, useState } from "react";
export const useWallet = (client: any, userId: string) => {
  const [debt,setDebt] = useState(0);
  const [debts,setDebts] = useState<any[]>([]);
  const [earnings,setEarnings] = useState(0);
  const load = async () => {
    const {data:d} = await client.from("driver_debts").select("*").eq("driver_id",userId).eq("is_paid",false);
    setDebts(d||[]);
    setDebt((d||[]).reduce((s:number,r:any)=>s+Number(r.amount),0));
    const {data:t} = await client.from("transport_orders").select("driver_amount").eq("driver_id",userId).eq("status","accepted");
    const {data:c} = await client.from("parcel_orders").select("driver_amount").eq("driver_id",userId).eq("status","accepted");
    setEarnings([...(t||[]),...(c||[])].reduce((s:number,o:any)=>s+Number(o.driver_amount),0));
  };
  useEffect(()=>{load();},[]);
  const pay = async (amount:number, method:"cash"|"cib"|"baridimob") => {
    await client.from("driver_payments").insert({driver_id:userId,amount,method});
    let rem = amount;
    for (const row of [...debts].sort((a,b)=>+new Date(a.created_at)-+new Date(b.created_at))) {
      if (rem<=0) break;
      if (Number(row.amount)<=rem){ await client.from("driver_debts").update({is_paid:true}).eq("id",row.id); rem-=Number(row.amount); }
    }
    await load();
  };
  return { debt, debts, earnings, isBanned: debt>=2000, pay, reload: load };
};
