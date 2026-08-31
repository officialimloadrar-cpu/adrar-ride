export const getCommissionRate = (service: string, distance: number): number => {
  if (service === "transport") return distance <= 10 ? 0.13 : 0.15;
  return 0.15;
};