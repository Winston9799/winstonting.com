import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const openSans = localFont({
  src: [
    { path: "./fonts/OpenSans-Variable.ttf", style: "normal" },
    { path: "./fonts/OpenSans-Italic-Variable.ttf", style: "italic" },
  ],
  variable: "--font-open-sans",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Winston Travels", template: "%s · Winston Travels" },
  description: "Personal travel reference and itineraries.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${notoSansSC.variable} ${notoSerifSC.variable}`}>
      <head />
      <body className="min-h-screen flex flex-col bg-[var(--background)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
