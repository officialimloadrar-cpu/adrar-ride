export const calcReturnPrice = (distance:number, originalTotal:number) => {
  const discount = distance > 150 ? 0.6 : 0.5;
  return Math.round(originalTotal * discount);
};
export const canReturn = (status:string, driverId:string|null) => status === "delivered" && !!driverId;
export const matchReturn = (orders:any[], driver:{lat:number,lon:number}) => orders.filter(o=>o.status==="pending_return");
