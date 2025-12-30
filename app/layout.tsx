import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
// 如果你也想支持中文本地化，可以引入 zhCN 包 (可选)
// import { zhCN } from "@clerk/localizations"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 智能问答",
  description: "Powered by Gemini & Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 关键：用 ClerkProvider 包裹应用
    <ClerkProvider>
      <html lang="zh-CN">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}