import { InputHTMLAttributes } from 'react'
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black" {...props} />
}
