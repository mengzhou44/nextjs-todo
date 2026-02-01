import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client/react";
import client from "@/lib/apollo-client";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Todo app" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
