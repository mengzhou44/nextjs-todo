import type { Metadata } from "next";
import { Providers } from "./providers";
import { Header } from "@/client/components/header";
import { Footer } from "@/client/components/footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Todo app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col bg-bg">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
