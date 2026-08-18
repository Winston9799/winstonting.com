// ─── EDIT THESE VALUES ───────────────────────────────────────────────────────
const TRIP_TITLE   = "成都探索之旅";
const TRIP_YEAR    = "2026";
const TRIP_SEASON  = "金秋";                        // shown next to year
const TRIP_DATES   = "9月17日 — 9月24日";
const TRIP_NIGHTS  = "7晚 8天";
const TRAVELLERS   = "Winston · Jinly";             // names in hero
const DESTINATION  = "中国 · 成都";                 // sub-label under title
// ─────────────────────────────────────────────────────────────────────────────

export default function Header() {
  return (
    <header className="relative bg-[var(--ink)] text-white overflow-hidden">
      {/* decorative gold rule */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--gold)]" />

      <div className="max-w-2xl mx-auto px-6 pt-14 pb-10 flex flex-col items-start gap-3">

        {/* eyebrow */}
        <p className="text-[10px] tracking-[3px] text-[rgba(212,160,23,.7)] uppercase font-sans">
          {TRIP_YEAR} &nbsp;{TRIP_SEASON}
        </p>

        {/* main title */}
        <h1
          className="font-serif font-bold leading-tight"
          style={{ fontSize: "clamp(28px, 7vw, 48px)" }}
        >
          {TRIP_TITLE}
        </h1>

        {/* destination */}
        <p className="text-sm text-white/50 tracking-widest font-sans">
          {DESTINATION}
        </p>

        {/* divider */}
        <div className="w-10 h-px bg-[var(--gold)] my-1" />

        {/* meta row */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/60 font-sans">
          <span>🗓 {TRIP_DATES}</span>
          <span>🌙 {TRIP_NIGHTS}</span>
          <span>✈️ {TRAVELLERS}</span>
        </div>
      </div>

      {/* bottom shadow fade */}
      <div className="h-4 bg-gradient-to-b from-transparent to-[var(--paper)]" />
    </header>
  );
}
