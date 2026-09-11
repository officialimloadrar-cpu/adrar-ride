export function round(v: number) { return Math.round(v) }
export function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }
export function formatPrice(p: number) { return `${Math.round(p)} DZD` }
