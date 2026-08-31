import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";

export const useDriverAuth = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getUser().then((res: any) => setUser(res.data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  const signIn = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
  const signUp = (email: string, password: string) => supabase.auth.signUp({ email, password });
  const signOut = () => supabase.auth.signOut();
  return { user, signIn, signUp, signOut };
};