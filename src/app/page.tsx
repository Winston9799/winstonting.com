// ─── HOMEPAGE CONTENT ─────────────────────────────────────────────────────────
// Dark/gold rebrand — Hero → Explore cards → Hotel showcase.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";

const EXTS = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
function nextSrc(src: string): string | null {
  const d = src.lastIndexOf(".");
  const base = src.slice(0, d);
  const ext = src.slice(d + 1);
  const i = EXTS.indexOf(ext);
  return i < EXTS.length - 1 ? `${base}.${EXTS[i + 1]}` : null;
}

function FallbackImg({ src, className, alt }: { src: string; className?: string; alt?: string }) {
  // Only assign the guessed src after mount — otherwise the browser can start
  // fetching it straight from the server-rendered HTML before React finishes
  // attaching onError, and a failed guess never gets retried.
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  if (hidden || !imgSrc) return null;
  return (
    <img
      key={imgSrc}
      src={imgSrc}
      alt={alt ?? ""}
      loading="lazy"
      className={className}
      onError={() => {
        const n = nextSrc(imgSrc);
        n ? setImgSrc(n) : setHidden(true);
      }}
    />
  );
}

function ArrowIcon() {
  return (
    <svg className="btn-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="bg-midnight">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative -mt-20 min-h-[92vh] flex items-center justify-center overflow-hidden" id="hero-trip">
        {/* Cinematic background layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="w-full h-full animate-hero-bg origin-center transform-gpu">
            <FallbackImg
              src="/hero-chengdu-nightview.jpg"
              alt="Chengdu night view"
              className="w-full h-full object-cover object-[center_35%] filter brightness-[0.92] contrast-[1.05]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-midnight/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-transparent to-midnight" />
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-gold-500/15 rounded-full blur-[100px] animate-water-glow pointer-events-none" />
          <div className="dust-particle w-1.5 h-1.5 bg-gold-400/70 blur-[0.5px] top-[45%] left-[28%]" style={{ animationDelay: "0s" }} />
          <div className="dust-particle w-2 h-2 bg-gold-300/80 blur-[1px] top-[52%] left-[46%]" style={{ animationDelay: "2.3s" }} />
          <div className="dust-particle w-1 h-1 bg-gold-500/90 top-[58%] left-[64%]" style={{ animationDelay: "4.1s" }} />
          <div className="dust-particle w-1.5 h-1.5 bg-amber-200/60 blur-[0.5px] top-[48%] left-[78%]" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-10 py-16 flex flex-col justify-end min-h-[75vh]">
          <div className="max-w-3xl space-y-6">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                Chengdu Exploration
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 font-light max-w-2xl leading-relaxed">
                An 8-day journey through Chengdu&rsquo;s timeless heritage, culinary artistry, and modern design culture.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-8">
              <a className="btn-luxury-cta px-8 py-3.5" href="/trip/chengdu-sep-2026">
                <span>View Itinerary</span>
                <ArrowIcon />
              </a>
              <a className="btn-luxury-cta px-8 py-3.5" href="/contact">
                <span>Contact Me</span>
                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight to-transparent pointer-events-none" />
      </section>

      {/* ── EXPLORE ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 bg-midnight border-t border-white/[0.04] overflow-hidden" id="explore-section">
        <div className="absolute top-12 left-1/3 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight bg-[linear-gradient(120deg,#f3e7c4,#f6be39_45%,#d4a017_80%)] bg-clip-text text-transparent">
              旅程专栏与探索
            </h2>
            <p className="text-sm text-neutral-400 mt-3">
              记录旅程灵感，探索下一段值得期待的旅行
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "成都探索之旅",
                desc: "8 days across Chengdu's best cultural and nature spots. Including ancient alleys, giant pandas, and culinary adventures.",
                href: "/trip/chengdu-sep-2026",
                cta: "View Trip",
              },
              {
                title: "Next Destination",
                desc: "Your next adventure goes here. Add a new page in nav.ts to catalog future journeys around the globe.",
                href: "#",
                cta: "Learn more",
              },
              {
                title: "Contact Me",
                desc: "Questions, collaborations, or just a hello. Drop an inquiry or discuss bespoke travel itineraries.",
                href: "/contact",
                cta: "Reach out",
              },
            ].map((card) => (
              <article key={card.title}
                className="relative group rounded-2xl glass-card card-sweep p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gold-500/10 flex flex-col justify-between overflow-hidden">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-neutral-100 group-hover:text-gold-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-8">
                  <a className="btn-luxury-cta px-6 py-2.5" href={card.href}>
                    <span>{card.cta}</span>
                    <ArrowIcon />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOTEL SHOWCASE ────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-deepslate border-t border-white/[0.06] overflow-hidden" id="hotel-showcase">
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight bg-[linear-gradient(120deg,#f3e7c4,#f6be39_45%,#d4a017_80%)] bg-clip-text text-transparent">
                  Pagoda君亭设计酒店
                </h2>
                <p className="text-sm text-neutral-400">
                  成都春熙路太古里店
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl glass-card backdrop-blur-md border border-white/5">
                  <div className="text-xs text-neutral-400">地理位置</div>
                  <div className="text-sm font-semibold text-white mt-1">春熙路 / 太古里商业圈</div>
                </div>
                <div className="p-4 rounded-2xl glass-card backdrop-blur-md border border-white/5">
                  <div className="text-xs text-neutral-400">客房景致</div>
                  <div className="text-sm font-semibold text-white mt-1">高楼层城景房</div>
                </div>
              </div>
              <div className="pt-4">
                <a className="btn-luxury-cta px-8 py-3.5" href="/trip/chengdu-sep-2026">
                  <span>查看完整每日入住安排</span>
                  <ArrowIcon />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative group mx-auto max-w-xl lg:max-w-none aspect-[16/10]">
                <FallbackImg
                  src="/images/pagoda-hotel/1.jpg"
                  alt="Pagoda Design Hotel Chengdu Taikoo Li"
                  className="hotel-photo-blend w-full h-full object-cover object-center filter contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
