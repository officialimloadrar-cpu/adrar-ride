export const calcPharma=(distance:number,tempControlled=false)=>{
  const base=distance<=15?300:distance<=150?500:900;
  return tempControlled?Math.round(base*1.3):base;
};
export const pharmaRules={maxWeight:5,requiresColdChain:false};
