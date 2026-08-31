export const calcRating = (ratings:number[]) => ratings.length ? ratings.reduce((s,n)=>s+n,0)/ratings.length : 5;
export const canRate = (status:string, raterId:string, ratedId:string) => status === "delivered" && raterId !== ratedId;
export const ratingSchema = { min:1, max:5 };
export const createRating = (orderId:string, from:string, to:string, score:number, comment:string) => ({ order_id: orderId, from_user: from, to_user: to, score: Math.min(5,Math.max(1,score)), comment: comment.slice(0,200), created_at: new Date().toISOString() });
