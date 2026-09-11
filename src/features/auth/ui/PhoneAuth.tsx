import { useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/button'
import { usePhoneAuth } from '../model/usePhoneAuth'
export function PhoneAuth() {
  const [phone, setPhone] = useState('')
  const { signIn, loading } = usePhoneAuth()
  return <div className="flex gap-2"><Input placeholder="+213..." value={phone} onChange={(e) => setPhone(e.target.value)} /><Button onClick={() => signIn(phone)} disabled={loading}>Send OTP</Button></div>
}
