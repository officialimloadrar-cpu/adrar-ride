export const calcTransport=(distance:number,seats:number=1,isNight=false)=>{
  let b=0;
  if(distance<=5) b=150; else if(distance<=10) b=Math.round(150+10*(distance-5)); else if(distance<=20) b=200; else if(distance<=30) b=Math.round(200+7*(distance-20)); else if(distance<=80) b=Math.round(270+6.6*(distance-30)); else b=Math.round(600+11.428*(distance-80));
  const f=[1,1.8333,2.6667,2.9667]; b=Math.round(b*f[Math.min(seats,4)-1]); if(isNight) b=Math.max(250,Math.round(b*1.25)); return b;
};
