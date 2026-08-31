export const toDZD = (n: number): number => Math.round(n);
export const add = (a: number, b: number): number => toDZD(a + b);
export const multiply = (a: number, rate: number): number => toDZD(a * rate);