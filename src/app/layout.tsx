// ─── ROOT LAYOUT ──────────────────────────────────────────────────────────────
// Wraps every route: loads fonts, applies global CSS, and renders the shared
// header/footer chrome around whatever page is active.
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { Lato, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// English body copy. Lato only ships Regular/Bold as text weights (no
// medium/semibold cut) — elements using font-medium or font-semibold will
// render at whichever of these two the browser matches closest.
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

// Chinese body/heading text (CJK glyphs aren't covered by Lato).
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
    <html lang="en" className={`${lato.variable} ${notoSansSC.variable}`}>
      <head />
      <body className="min-h-screen flex flex-col bg-[var(--background)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
