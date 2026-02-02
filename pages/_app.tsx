import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client/react";
import client from "@/lib/apollo-client";
import { UserProvider } from "@/client/context/user-context";
import { Header } from "@/client/components/header";
import { Footer } from "@/client/components/footer";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <Head>
          <title>Todo App</title>
          <meta name="description" content="Todo app" />
        </Head>
        <div className="min-h-screen flex flex-col bg-bg">
          <Header />
          <div className="flex-1">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </UserProvider>
    </ApolloProvider>
  );
}
