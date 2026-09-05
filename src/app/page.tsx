// ─── HOMEPAGE CONTENT ─────────────────────────────────────────────────────────
// Replace placeholder text, images, and links below.
// Section structure mirrors samsung.com/sg:
//   Hero → Feature cards → Wide promo
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";

const EXTS = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
function nextSrc(src: string): string | null {
  const d = src.lastIndexOf(".");
  const base = src.slice(0, d);
  const ext = src.slice(d + 1);
  const i = EXTS.indexOf(ext);
  return i < EXTS.length - 1 ? `${base}.${EXTS[i + 1]}` : null;
}

function FallbackImg({ src, className }: { src: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <img
      src={imgSrc}
      alt=""
      loading="lazy"
      className={className}
      onError={() => {
        const n = nextSrc(imgSrc);
        n ? setImgSrc(n) : setHidden(true);
      }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden"
        style={{ minHeight: "min(80vh, 700px)" }}>
        <img
          src="/hero-chengdu-nightview.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="relative z-10 flex flex-col items-start justify-end h-full max-w-screen-lg mx-auto px-8 pb-16 pt-40">
          <span className="text-sm sm:text-base tracking-[3px] uppercase text-white font-bold mb-4">
            Upcoming Trip
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] max-w-xl mb-4">
            成都探索之旅
            <span className="block text-3xl sm:text-4xl font-bold text-white/90 mt-2">
              Chengdu 2026
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-normal text-white max-w-sm mb-8 leading-relaxed">
            8 days · 12 attractions · Pagoda Design Hotel · September 2026
          </p>

          <div className="flex gap-3 flex-wrap">
            <a href="/trip/chengdu-sep-2026"
              className="px-7 py-3 bg-white text-[var(--foreground)] text-base font-bold rounded-full hover:bg-gray-100 transition-colors">
              View Itinerary
            </a>
            <a href="/contact"
              className="px-7 py-3 border border-white/40 text-white text-base font-bold rounded-full hover:bg-white/10 transition-colors">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ─────────────────────────────────────────────────── */}
      <section className="max-w-screen-lg mx-auto px-8 py-16">
        <h2 className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--muted)] mb-8">
          Explore
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              bg: "bg-[#f0ede8]",
              tag: "Trip · 2026",
              title: "成都探索之旅",
              desc: "8 days across Chengdu's best cultural and nature spots.",
              href: "/trip/chengdu-sep-2026",
              cta: "View Trip →",
            },
            {
              bg: "bg-[#eef2f7]",
              tag: "Coming soon",
              title: "Next Destination",
              desc: "Your next adventure goes here. Add a new page in nav.ts.",
              href: "#",
              cta: "Learn more →",
            },
            {
              bg: "bg-[#f7f0ee]",
              tag: "Get in touch",
              title: "Contact Me",
              desc: "Questions, collaborations, or just a hello.",
              href: "/contact",
              cta: "Reach out →",
            },
          ].map((card) => (
            <a key={card.title} href={card.href}
              className={`${card.bg} rounded-2xl p-8 flex flex-col gap-3 group hover:shadow-lg transition-shadow`}>
              <span className="text-[10px] tracking-[2px] uppercase text-[var(--muted)] font-medium">
                {card.tag}
              </span>
              <h3 className="text-[22px] font-bold text-[var(--foreground)] leading-tight">
                {card.title}
              </h3>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed flex-1">
                {card.desc}
              </p>
              <span className="text-[13px] font-medium text-[var(--accent)] group-hover:underline">
                {card.cta}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── WIDE PROMO BANNER ─────────────────────────────────────────────── */}
      <section className="bg-[#1d1d1d] py-20">
        <div className="max-w-screen-lg mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[11px] tracking-[2px] uppercase text-white/40 font-medium mb-3">
              September 2026
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight max-w-md">
              Pagoda Design Hotel
              <span className="block font-light text-white/60">成都太古里柏廿设计酒店</span>
            </h2>
            <p className="text-[13px] text-white/50 mt-3 max-w-xs leading-relaxed">
              高楼层城景房 · 2张单人床 · 含每日早餐 · 五星级 · 7晚
            </p>
          </div>
          <div className="w-full sm:w-80 h-48 rounded-2xl overflow-hidden bg-white/5">
            <FallbackImg src="/images/pagoda-hotel/1.jpg" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

    </>
  );
}
