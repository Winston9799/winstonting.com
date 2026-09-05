// ─── EDIT THESE VALUES ───────────────────────────────────────────────────────
const MADE_BY      = "Winston";
const TRIP_YEAR    = "2026";
const HOTEL_NAME   = "Pagoda Design Hotel Chengdu";
const HOTEL_ADDR   = "锦江区华兴东街16号";
const CONTACT_NOTE = "";                            // optional note; leave "" to hide
const FOOTER_LINKS: { label: string; href: string }[] = [
  // add any links here, e.g. { label: "地图", href: "https://..." }
];
// ─────────────────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-white/50 mt-16">
      {/* gold rule */}
      <div className="h-px bg-[var(--gold)]/30" />

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-5">

        {/* hotel block */}
        <div className="text-xs font-sans leading-relaxed">
          <p className="text-white/80 font-medium">{HOTEL_NAME}</p>
          <p>{HOTEL_ADDR}</p>
        </div>

        {/* optional links */}
        {FOOTER_LINKS.length > 0 && (
          <div className="flex flex-wrap gap-4 text-xs">
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--gold)] hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}

        {/* optional contact note */}
        {CONTACT_NOTE && (
          <p className="text-xs">{CONTACT_NOTE}</p>
        )}

        {/* divider */}
        <div className="h-px bg-white/10" />

        {/* copyright */}
        <p className="text-[10px] tracking-widest uppercase font-sans">
          &copy; {TRIP_YEAR} &nbsp;{MADE_BY} &nbsp;·&nbsp; 私人行程 · 仅供参考
        </p>
      </div>
    </footer>
  );
}
