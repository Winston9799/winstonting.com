import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "成都探索之旅 2026",
  description: "8-day Chengdu itinerary — September 2026.",
};

// ─── TRIP PAGE ────────────────────────────────────────────────────────────────
// This page will hold the full Chengdu itinerary content.
// The existing index.html content can be migrated here section by section.
// ─────────────────────────────────────────────────────────────────────────────

export default function TripPage() {
  return (
    <div className="max-w-screen-lg mx-auto px-8 py-12">

      {/* ── Page header ── */}
      <div className="mb-12">
        <span className="text-[10px] tracking-[3px] uppercase text-[var(--muted)] font-medium">
          Trip · September 2026
        </span>
        <h1 className="mt-3 text-4xl font-bold text-[var(--foreground)] leading-tight">
          成都探索之旅
        </h1>
        <p className="mt-2 text-[var(--muted)]">Chengdu, China · 8 days · 12 attractions</p>
      </div>

      {/* ── Quick stats ── */}
      <div id="overview" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {[
          { label: "出发", value: "9月17日" },
          { label: "返程", value: "9月24日" },
          { label: "住宿", value: "JW Marriott" },
          { label: "成员", value: "Winston · Jinly" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--surface)] rounded-xl p-5">
            <p className="text-[10px] uppercase tracking-[2px] text-[var(--muted)] font-medium mb-1">
              {s.label}
            </p>
            <p className="text-[15px] font-semibold text-[var(--foreground)]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Itinerary placeholder ── */}
      <div id="itinerary" className="space-y-6">
        <h2 className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--muted)]">
          每日行程
        </h2>
        <div className="rounded-2xl border border-[var(--border)] p-8 text-center text-[var(--muted)] text-sm">
          Itinerary content will be migrated here from <code>index.html</code>.
          <br />
          Each day becomes a section with <code id="day-1">#day-1</code>, <code>#day-2</code>, etc.
        </div>
      </div>

      {/* ── Hotel ── */}
      <div id="hotel" className="mt-14">
        <h2 className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--muted)] mb-6">
          住宿
        </h2>
        <div className="bg-[#1d1d1d] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-[10px] tracking-[2px] uppercase text-white/40 mb-2">Hotel · 7 Nights</p>
            <h3 className="text-xl font-bold mb-1">JW Marriott Hotel Chengdu</h3>
            <p className="text-white/60 text-[13px]">成都茂业JW万豪酒店 · 锦江区东御街19号</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {["🛏️ 高楼层景房 · 2张大床", "🍳 含每日早餐", "⭐ 五星级"].map((t) => (
                <span key={t} className="text-[12px] text-white/50 bg-white/5 px-3 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full sm:w-48 h-32 rounded-xl bg-white/5 flex items-center justify-center text-white/20 text-xs">
            [ Hotel photo ]
          </div>
        </div>
      </div>

    </div>
  );
}
