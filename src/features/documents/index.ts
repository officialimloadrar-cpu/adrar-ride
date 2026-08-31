export const calcDocuments=(distance:number,urgent=false)=>{
  const base=distance<=15?200:distance<=150?350:700;
  return urgent?Math.round(base*1.5):base;
};
export const isDocumentEligible=(weight:number)=> weight<=2;
