import type { Metadata } from "next";
import "./globals.css";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";

export const metadata: Metadata = {
  title: "EdgeOne Pages Next.js Starter - Hybrid Rendering Demo",
  description: "Using Next.js to build high-performance, scalable Web applications on EdgeOne Pages. Demonstrating SSR, ISR, SSG, Node Functions, and Edge Functions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className="dark">
      <body className="bg-black text-white antialiased">
        <LoadingProvider>
          <TopLoadingBar />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
