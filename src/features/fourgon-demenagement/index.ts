export const calcVan=(distance:number,type:"small"|"large",fridge=false)=>{
  let total=0;
  if(type==="small") total=distance<=15?800:800+21*distance;
  else total=distance<=15?2000:2000+60*distance;
  if(fridge) total*=1.2;
  return Math.round(total);
};
export const isVanEligible=(distance:number)=> distance>5;
