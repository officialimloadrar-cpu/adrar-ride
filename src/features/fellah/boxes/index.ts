export const calcBoxes=(count:number,distance:number)=>{
  const national=distance>150;
  if(count>=21) return national?9000:5000;
  let unit=0;
  if(!national) unit=count<=5?300:count<=10?270:250;
  else unit=count<=5?600:count<=10?540:500;
  return unit*count;
};
