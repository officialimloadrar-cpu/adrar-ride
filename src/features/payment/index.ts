export type Method = "cash"|"cib"|"baridimob"|"wallet";
export const calcPaySplit = (total:number, rate:number) => ({ total, commission: Math.round(total*rate), driver: Math.round(total*(1-rate)) });
export const validatePayment = (amount:number, debt:number) => amount > 0 && amount <= debt;
export const createPaymentRecord = (driverId:string, amount:number, method:Method) => ({ driver_id: driverId, amount, method, created_at: new Date().toISOString() });
