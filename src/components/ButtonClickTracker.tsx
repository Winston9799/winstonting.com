// ─── BUTTON CLICK TRACKER ─────────────────────────────────────────────────────
// One delegated click listener for the whole site instead of an onClick on
// every CTA — new .a-cta / .btn-luxury-cta buttons get tracked automatically,
// no per-button wiring needed. Each click pushes a dataLayer event whose NAME
// is derived from that button's own text (e.g. "View Itinerary" ->
// "button_view_itinerary"), not a single generic event name — so GTM can
// trigger on a pattern like "button_.*" and GA4 reports show one event per
// button. Chinese labels go through pinyin first (GA4 event names must be
// ASCII letters/numbers/underscores — a raw Chinese name would silently be
// dropped or mangled), e.g. "现在兑换" -> "button_xian_zai_dui_huan".
"use client";

import { useEffect } from "react";
import { pinyin } from "pinyin-pro";

const TRACKED_SELECTOR = ".a-cta, .btn-luxury-cta";
// GA4's own event-name length cap.
const GA4_EVENT_NAME_MAX = 40;

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function slugify(text: string): string {
  const words = pinyin(text, { toneType: "none", type: "array", nonZh: "consecutive" });
  const slug = words
    .join("_")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "unnamed";
}

function toEventName(buttonName: string): string {
  let name = `button_${slugify(buttonName)}`;
  if (name.length > GA4_EVENT_NAME_MAX) {
    name = name.slice(0, GA4_EVENT_NAME_MAX).replace(/_+$/, "");
  }
  return name;
}

export default function ButtonClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(TRACKED_SELECTOR);
      if (!target) return;

      const buttonName = target.textContent?.trim() || "(unnamed button)";
      const buttonHref = target instanceof HTMLAnchorElement ? target.href : undefined;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: toEventName(buttonName),
        button_name: buttonName,
        button_href: buttonHref,
        page_path: window.location.pathname,
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
