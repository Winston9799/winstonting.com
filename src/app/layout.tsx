import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import NavMenu from "@/components/NavMenu";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "成都探索之旅 · 2026金秋",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col bg-[var(--paper)]">
        <Header />
        <NavMenu />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
