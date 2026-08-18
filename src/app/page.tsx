import Link from "next/link";

// ─── HOMEPAGE CONTENT ─────────────────────────────────────────────────────────
// Replace placeholder text, images, and links below.
// Section structure mirrors samsung.com/sg:
//   Hero → Feature cards → Wide promo → Category grid
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      {/* Replace bg-gray-900 with a real <Image> or CSS background-image     */}
      <section className="relative w-full bg-gray-900 overflow-hidden"
        style={{ minHeight: "min(80vh, 700px)" }}>
        {/* Placeholder background — swap with <Image fill src="..." /> */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />

        <div className="relative z-10 flex flex-col items-start justify-end h-full max-w-screen-lg mx-auto px-8 pb-16 pt-40">
          {/* Eyebrow tag */}
          <span className="text-[11px] tracking-[3px] uppercase text-white/50 mb-4 font-medium">
            Latest Trip
          </span>

          {/* Headline — edit this */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] max-w-xl mb-4">
            成都探索之旅
            <span className="block text-2xl sm:text-3xl font-light text-white/60 mt-2">
              Chengdu 2026
            </span>
          </h1>

          {/* Sub-copy */}
          <p className="text-[15px] text-white/60 max-w-sm mb-8 leading-relaxed">
            8 days · 12 attractions · JW Marriott · September 2026
          </p>

          {/* CTA */}
          <div className="flex gap-3 flex-wrap">
            <Link href="/trip"
              className="px-7 py-3 bg-white text-[var(--foreground)] text-[13px] font-semibold rounded-full hover:bg-gray-100 transition-colors">
              View Itinerary
            </Link>
            <Link href="/contact"
              className="px-7 py-3 border border-white/40 text-white text-[13px] font-semibold rounded-full hover:bg-white/10 transition-colors">
              Contact Me
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ─────────────────────────────────────────────────── */}
      {/* Replace each card's bg-color, title, desc, and href                 */}
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
              href: "/trip",
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
            <Link key={card.title} href={card.href}
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
            </Link>
          ))}
        </div>
      </section>

      {/* ── WIDE PROMO BANNER ─────────────────────────────────────────────── */}
      {/* Replace bg-[#1d1d1d] and text/image content                          */}
      <section className="bg-[#1d1d1d] py-20">
        <div className="max-w-screen-lg mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[11px] tracking-[2px] uppercase text-white/40 font-medium mb-3">
              September 2026
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight max-w-md">
              JW Marriott
              <span className="block font-light text-white/60">成都茂业万豪</span>
            </h2>
            <p className="text-[13px] text-white/50 mt-3 max-w-xs leading-relaxed">
              高楼层景房 · 2张大床 · 含每日早餐 · 五星级 · 7晚
            </p>
          </div>
          {/* Replace this div with an <Image /> */}
          <div className="w-full sm:w-80 h-48 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 text-sm">
            [ Hotel photo ]
          </div>
        </div>
      </section>

    </>
  );
}
