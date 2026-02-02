"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/client/context/user-context";
import { clearAccessToken } from "@/lib/apollo-client";

export function Header() {
  const router = useRouter();
  const { email, refreshUser } = useUser();

  function handleLogout() {
    clearAccessToken();
    refreshUser();
    router.push("/login");
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/todo" className="text-xl font-bold text-accent">
          Todo App
        </Link>
        <div className="flex items-center gap-4">
          {email ? (
            <>
              <span className="text-sm text-text-muted">{email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-text-muted hover:text-text px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
