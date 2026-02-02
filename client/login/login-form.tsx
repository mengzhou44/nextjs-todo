"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { setAccessToken } from "@/lib/apollo-client";
import { useUser } from "@/client/context/user-context";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

export function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, { loading }] = useMutation<{
    login: { accessToken: string };
  }>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      setAccessToken(data.login.accessToken);
      refreshUser();
      router.push("/todo");
    },
    onError: (err) => setError(err.message),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login({ variables: { email, password } });
    } catch {
      setError("Something went wrong");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-[400px]">
        <h1 className="text-3xl font-bold mb-6 text-accent">Todo App</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-6 bg-surface border border-border rounded-lg"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mengzhou44@gmail.com"
              required
              className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-accent text-bg border-0 rounded-lg font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
