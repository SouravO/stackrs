import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import { API } from "../variables/variables";



const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  async function enrichWithRole(supabaseUser) {
    if (!supabaseUser) return null;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token)
        return { ...supabaseUser, role: "NORMAL_USER" };

      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) return { ...supabaseUser, role: "NORMAL_USER" };

      const data = await res.json();
      return {
        ...supabaseUser,
        ...data.user,
        role: data.user.role || "NORMAL_USER",
      };
    } catch {
      return { ...supabaseUser, role: "NORMAL_USER" };
    }
  }

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          const enriched = await enrichWithRole(session.user);
          setUser(enriched);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser((prev) => {
          if (!prev) return session.user;
          return { ...session.user, role: prev.role };
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signOut, updateUser, enrichWithRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
