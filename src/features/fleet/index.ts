export type Fleet="h100"|"van_short"|"van_long"|"truck_small_short"|"truck_small_long"|"truck_large_short"|"truck_large_long"|"semi";
export const calcFleet=(type:Fleet,distance:number,fridge=false)=>{
  if(distance<=15) throw new Error("USE_LOCAL_FORFAIT");
  let total=0;
  switch(type){
    case "h100": total=600+20*distance; break;
    case "van_short": total=800+21*distance; break;
    case "van_long": total=2000+60*distance; break;
    case "truck_small_short": total=1500+35*distance; break;
    case "truck_small_long": total=3000+70*distance; break;
    case "truck_large_short": total=2000+45*distance; break;
    case "truck_large_long": total=4000+85*distance; break;
    case "semi": total=distance<=150?10000:150*distance; break;
  }
  if(fridge) total*=1.2;
  return Math.round(total);
};
