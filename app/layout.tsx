import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "西北很慌 AI封面生成器",
  description: "使用集梦API生成不同风格的AI封面图片",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
