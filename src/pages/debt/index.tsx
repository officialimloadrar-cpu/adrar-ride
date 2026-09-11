import { useDriverDebt } from "@/entities/driver/model/useDriverDebt";
export default function DebtPage(){
  const {debt, rows}=useDriverDebt(0);
  return <div style={{padding:20}}><h1>Debt: {debt} DA</h1><div>{rows.length} records</div></div>;
}

