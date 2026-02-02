"use client";

import { ApolloProvider } from "@apollo/client/react";
import client from "@/lib/apollo-client";
import { UserProvider } from "@/client/context/user-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <UserProvider>{children}</UserProvider>
    </ApolloProvider>
  );
}
