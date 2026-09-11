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

export default function HomeClient() {
  return (
    <div className="bg-midnight">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative -mt-16 min-h-[92vh] flex items-center justify-center overflow-hidden" id="hero-trip">
        {/* Cinematic background layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="w-full h-full animate-hero-bg origin-center transform-gpu">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/hero-video-poster.jpg"
              // @ts-expect-error -- fetchPriority isn't in this React version's VideoHTMLAttributes typings yet, but the browser attribute is real and valid
              fetchPriority="high"
              className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.05]"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-transparent to-midnight/85" />
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-gold-500/15 rounded-full blur-[100px] animate-water-glow pointer-events-none" />
          <div className="dust-particle w-1.5 h-1.5 bg-gold-400/70 blur-[0.5px] top-[45%] left-[28%]" style={{ animationDelay: "0s" }} />
          <div className="dust-particle w-2 h-2 bg-gold-300/80 blur-[1px] top-[52%] left-[46%]" style={{ animationDelay: "2.3s" }} />
          <div className="dust-particle w-1 h-1 bg-gold-500/90 top-[58%] left-[64%]" style={{ animationDelay: "4.1s" }} />
          <div className="dust-particle w-1.5 h-1.5 bg-amber-200/60 blur-[0.5px] top-[48%] left-[78%]" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-10 py-16 flex flex-col items-center justify-center text-center min-h-[75vh]">
          <div className="max-w-3xl space-y-6">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                Winston&rsquo;s Adventure
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 font-medium max-w-2xl mx-auto leading-relaxed">
                Next Adventure - Chengdu, China, a city full of heritage, culinary artistry, and modern design culture.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <a className="btn-luxury-cta px-8 py-3.5" href="/trip/chengdu-sep-2026">
                <span>View Itinerary</span>
                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight to-transparent pointer-events-none" />
      </section>

      {/* ── EXPLORE ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 bg-midnight overflow-hidden" id="explore-section">
        <div className="absolute top-12 left-1/3 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight bg-[linear-gradient(120deg,#fff_0%,#f3e7c4_25%,#f6be39_60%,#d4a017_90%)] bg-clip-text text-transparent">
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
                noMobileGold: true,
              },
              {
                title: "Contact Me",
                desc: "Questions, collaborations, or just a hello. Drop an inquiry or discuss bespoke travel itineraries.",
                href: "/contact",
                cta: "Reach out",
                noMobileGold: true,
              },
            ].map((card) => (
              <article key={card.title}
                className="relative group rounded-2xl glass-card card-sweep p-8 transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-gold-500/10 flex flex-col justify-between overflow-hidden">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-neutral-100 group-hover:text-gold-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-8">
                  <a className={`btn-luxury-cta px-6 py-2.5${card.noMobileGold ? " btn-dim-mobile" : ""}`} href={card.href}>
                    <span>{card.cta}</span>
                    <ArrowIcon />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAY SHOWCASE ─────────────────────────────────────────────────── */}
      <section className="relative py-40 md:py-56 min-h-[560px] flex items-center justify-center overflow-hidden" id="hotel-showcase">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <FallbackImg
            src="/images/stay-showcase/1.png"
            alt="Aerial view of a snow-covered coastal city at night"
            className="absolute inset-0 w-full h-full object-cover scale-105 filter blur-[2px] brightness-[0.55] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-midnight/35" />
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight bg-[linear-gradient(120deg,#fff_0%,#f3e7c4_25%,#f6be39_60%,#d4a017_90%)] bg-clip-text text-transparent">
            旅居之选
          </h2>
          <p className="text-sm text-neutral-300 mt-2">
            每一程，用心挑选落脚之处
          </p>
        </div>

        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-midnight to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-midnight to-transparent pointer-events-none" />
      </section>
    </div>
  );
}
