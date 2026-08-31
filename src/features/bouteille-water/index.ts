export const calcBottle=(distance:number, refill=0)=>{
  const base=distance<=150?400:800;
  return base+refill;
};
export const calcWaterBatch=(count:number,distance:number)=>{
  const unit=distance<=150?400:800;
  return unit*count;
};
