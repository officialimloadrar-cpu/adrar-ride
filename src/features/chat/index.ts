export interface Message { id:string; orderId:string; senderId:string; text:string; createdAt:string; }
export const createMessage = (orderId:string, senderId:string, text:string):Message => ({ id: crypto.randomUUID(), orderId, senderId, text: text.slice(0,500), createdAt: new Date().toISOString() });
export const canChat = (status:string) => ["pending","accepted"].includes(status);
export const chatChannel = (orderId:string) => `chat:${orderId}`;
