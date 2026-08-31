export const calcTrip=(distance:number,seats:number,isNight=false)=>{
  let base=0;
  if(distance<=5) base=150;
  else if(distance<=10) base=Math.round(150+10*(distance-5));
  else if(distance<=20) base=200;
  else if(distance<=30) base=Math.round(200+7*(distance-20));
  else if(distance<=80) base=Math.round(270+6.6*(distance-30));
  else base=Math.round(600+11.428*(distance-80));
  const factors=[1,1.8333,2.6667,2.9667];
  base=Math.round(base*factors[Math.min(seats,4)-1]);
  if(isNight) base=Math.max(250,Math.round(base*1.25));
  return base;
};
