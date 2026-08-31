export const PET_TYPES = ["dog","cat","bird","other"] as const;
export const calcPetPrice = (distance:number, weight:number, type:string) => {
  const base = distance <= 15 ? 800 : 800 + (distance-15)*35;
  const w = weight > 10 ? base * 1.3 : base;
  const t = type === "dog" && weight > 20 ? w * 1.2 : w;
  return Math.round(t);
};
export const isPetEligible = (weight:number) => weight <= 40;
