// ─── SEARCH MODAL ─────────────────────────────────────────────────────────────
// Simple client-side filter over SEARCH_INDEX (src/lib/searchIndex.ts) — no
// backend, no external search service. Opened/closed by SiteHeader.
"use client";

import { useEffect, useRef, useState } from "react";
import { SEARCH_INDEX } from "@/lib/searchIndex";

function matches(query: string, entry: (typeof SEARCH_INDEX)[number]) {
  const q = query.toLowerCase();
  return (
    entry.label.toLowerCase().includes(q) ||
    entry.description.toLowerCase().includes(q) ||
    entry.keywords?.some((k) => k.toLowerCase().includes(q))
  );
}

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      // Focus after the modal has actually mounted/painted.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const results = query.trim()
    ? SEARCH_INDEX.filter((e) => matches(query, e))
    : SEARCH_INDEX;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-surface border border-white/10 shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-400 shrink-0">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, days, activities…"
            className="flex-1 bg-transparent text-white placeholder:text-neutral-500 text-sm outline-none"
          />
          <button
            aria-label="Close search"
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18" /><path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="px-5 py-6 text-sm text-neutral-500 text-center">No results for &ldquo;{query}&rdquo;</p>
          )}
          {results.map((entry) => (
            <a
              key={entry.href}
              href={entry.href}
              onClick={onClose}
              className="block px-5 py-3 hover:bg-white/5 transition-colors"
            >
              <div className="text-sm font-medium text-white">{entry.label}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{entry.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
