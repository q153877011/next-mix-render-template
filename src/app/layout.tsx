import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EdgeOne Pages Next.js Starter - 混合渲染演示",
  description: "在 EdgeOne Pages 上使用 Next.js 来构建高性能、可扩展的Web应用。演示 SSR、ISR、SSG、Node Functions 和 Edge Functions。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
