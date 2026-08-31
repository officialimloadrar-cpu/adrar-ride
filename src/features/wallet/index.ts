export interface WalletState { debt:number; earnings:number; isBanned:boolean; }
export const BAN_LIMIT = 2000;
export const calcWallet = (debts:number[], earnings:number[]):WalletState => {
  const debt = debts.reduce((s,n)=>s+n,0);
  return { debt, earnings: earnings.reduce((s,n)=>s+n,0), isBanned: debt >= BAN_LIMIT };
};
export const useWalletLogic = (client:any, userId:string) => ({
  load: async () => {
    const {data} = await client.from("driver_debts").select("amount").eq("driver_id",userId).eq("is_paid",false);
    return (data||[]).reduce((s:number,r:any)=>s+Number(r.amount),0);
  }
});
