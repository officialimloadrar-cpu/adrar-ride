export const calcSheep=(count:number,distance:number)=>{
  const national=distance>150;
  const unit=national?(count<=5?700:count<=10?600:500):(count<=5?400:count<=10?350:300);
  return {unit,total:unit*count};
};
export const calcCalf=(count:number,distance:number)=>{
  const unit=distance>150?2500:1500;
  return {unit,total:unit*count};
};
