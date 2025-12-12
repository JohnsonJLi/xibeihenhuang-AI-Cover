import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "西北很荒 AI Cover",
  description: "AI Cover Application",
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
