import { useState } from "react";
export function usePhoneAuth() {
  const [loading, setLoading] = useState(false);
  async function signIn(phone: string) {
    setLoading(true);
    try { console.log(phone); } finally { setLoading(false); }
  }
  return { signIn, loading };
}
