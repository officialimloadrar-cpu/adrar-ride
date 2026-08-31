export const calcLight=(weight:number,dim:number,distance:number)=>{
  if(weight>30) throw new Error("MAX_WEIGHT_30");
  const size=dim>60?"L":dim>40||weight>2?"M":"S";
  const zone=distance<=15?"city":distance<=150?"region":"national";
  const table:any={city:{S:250,M:300,L:500},region:{S:400,M:500,L:700},national:{S:800,M:1000,L:1300}};
  return table[zone][size];
};
export const LIGHT_LIMITS={maxWeight:30,maxDim:200};
