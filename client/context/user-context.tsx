"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import { getAccessToken } from "@/lib/apollo-client";

function decodeJwtPayload(token: string): { email?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { email?: string };
    return payload;
  } catch {
    return null;
  }
}

interface UserContextValue {
  email: string | null;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  const refreshUser = useCallback(() => {
    const token = getAccessToken();
    if (token) {
      const payload = decodeJwtPayload(token);
      setEmail(payload?.email ?? null);
    } else {
      setEmail(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser, router.pathname]);

  return (
    <UserContext.Provider value={{ email, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
