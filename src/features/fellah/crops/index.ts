export const calcCrops=(weight:number,distance:number)=>{
  const base=distance<=15?300:distance<=150?600:1200;
  const extra=weight>10?(weight-10)*20:0;
  return Math.round(base+extra);
};
