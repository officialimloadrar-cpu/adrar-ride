export const calcRabbits=(count:number,distance:number)=>{
  const unit=distance>150?200:100;
  return unit*count;
};
