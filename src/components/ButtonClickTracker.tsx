// ─── BUTTON CLICK TRACKER ─────────────────────────────────────────────────────
// One delegated click listener for the whole site instead of an onClick on
// every CTA — new .a-cta / .btn-luxury-cta buttons get tracked automatically,
// no per-button wiring needed. Pushes a single "button_click" dataLayer event
// per click, with the button's own visible text as button_name, for GTM to
// pick up (see a GA4 Event tag triggered on that event name).
"use client";

import { useEffect } from "react";

const TRACKED_SELECTOR = ".a-cta, .btn-luxury-cta";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
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
        event: "button_click",
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
