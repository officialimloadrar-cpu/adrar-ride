import { zoneFromDistance } from "@/entities/geo/zones";
export const calcParcel=(w:number,dim:number,dist:number)=>{
  if(w>30) throw new Error("MAX_WEIGHT");
  const size=dim>60?"L":dim>40||w>2?"M":"S";
  const zone=zoneFromDistance(dist);
  const t:any={city:{S:250,M:300,L:500},region:{S:400,M:500,L:700},national:{S:800,M:1000,L:1300}};
  return t[zone][size];
};
export const calcLight=(w:number,dist:number)=> calcParcel(w,30,dist);
export const calcHeavy=(w:number,dist:number)=> calcParcel(w,70,dist);
