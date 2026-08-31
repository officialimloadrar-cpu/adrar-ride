export const calcPoultry=(count:number,distance:number)=>{
  const unit=distance>150?150:80;
  return unit*count;
};
export const calcPoultryBatch=(count:number,distance:number)=>{
  if(count>=100) return distance>150?12000:6000;
  return count*(distance>150?150:80);
};
