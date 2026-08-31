export const add = (current: number, commission: number): number => current + commission;
export const pay = (current: number, amount: number): number => Math.max(0, current - amount);
export const balance = (debt: number): number => debt;