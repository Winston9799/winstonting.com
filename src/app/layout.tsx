// ─── ROOT LAYOUT ──────────────────────────────────────────────────────────────
// Wraps every route: loads fonts, applies global CSS, and renders the shared
// header/footer chrome around whatever page is active.
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// ─── EDIT ANALYTICS ID ────────────────────────────────────────────────────────
const GA_MEASUREMENT_ID = "G-ZJ0TTRNBV4";
// ─────────────────────────────────────────────────────────────────────────────

// Self-hosted variable-width Open Sans (English body copy)
const openSans = localFont({
  src: [
    { path: "./fonts/OpenSans-Variable.ttf", style: "normal" },
    { path: "./fonts/OpenSans-Italic-Variable.ttf", style: "italic" },
  ],
  variable: "--font-open-sans",
  display: "swap",
});

// Chinese body/heading text (CJK glyphs aren't covered by Open Sans).
// Weights loaded here must match every font-weight actually used on-screen —
// site-wide text is capped at semibold(600), so heavier cuts aren't fetched.
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Winston Travels", template: "%s · Winston Travels" },
  description: "Personal travel reference and itineraries.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${notoSansSC.variable}`}>
      <head />
      <body className="min-h-screen flex flex-col bg-[var(--background)]">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
