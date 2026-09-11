export function MapPlaceholder({ lat, lng }: { lat?: number; lng?: number }) {
  return <div className="h-64 w-full rounded-2xl bg-zinc-100 flex items-center justify-center">MAP {lat?.toFixed(4)} {lng?.toFixed(4)}</div>
}
