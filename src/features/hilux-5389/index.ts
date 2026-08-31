export const PICKUP_BASE=1500;
export const PICKUP_RATE=53.89;
export const calcPickup=(distance:number)=>{
  return distance<=15?PICKUP_BASE:Math.round(PICKUP_BASE+(distance-15)*PICKUP_RATE);
};
export const calcPickupFleet=(distance:number)=>{
  return distance<=15?0:Math.round((distance-15)*PICKUP_RATE);
};
