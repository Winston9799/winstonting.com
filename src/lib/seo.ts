// ─── PER-PAGE SEO ────────────────────────────────────────────────────────────
// Single place to edit each page's title, description, keywords, canonical
// URL, and JSON-LD structured data. Add a new entry here for any new page,
// then have that page's `metadata` export read it (see how contact/page.tsx,
// trip/chengdu-sep-2026/page.tsx, and page.tsx do it) and render <JsonLd
// data={SEO.<key>.jsonLd} /> somewhere in its JSX.
//
// Every field below is optional — leave any of them out (or delete a whole
// line) and that piece just falls back cleanly instead of breaking anything:
// title/description fall back to the site-wide default in layout.tsx,
// keywords/canonical/jsonLd are simply omitted from the page if left blank.
//
// Note: the site is currently set to noindex (see layout.tsx's `robots`) —
// none of this affects search rankings until that's turned off, but title/
// description still show in the browser tab and in link previews (social,
// iMessage, etc.) regardless of indexing.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL = "https://winstonting.com";

export interface PageSeo {
  title?: string;
  description?: string;
  keywords?: string[];
  /** Path only, e.g. "/" or "/contact" — SITE_URL is prepended for you. */
  path?: string;
  jsonLd?: Record<string, unknown>;
}

export const SEO = {
  home: {
    title: "Winston Travels",
    description:
      "Personal travel reference and itineraries — explore Winston's upcoming and past adventures, starting with an 8-day trip to Chengdu, China.",
    keywords: ["Winston travels", "travel itinerary", "Chengdu trip", "travel blog", "China travel guide"],
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Winston Travels",
      url: SITE_URL,
      description: "Personal travel reference and itineraries.",
    },
  },

  contact: {
    title: "Contact Me",
    description: "Get in touch with Winston — questions, collaborations, or travel itinerary inquiries.",
    keywords: ["contact Winston", "travel inquiries", "collaborate"],
    path: "/contact",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Me",
      url: `${SITE_URL}/contact`,
    },
  },

  chengduTrip: {
    title: "Chengdu Sep 2026",
    description: "成都探索之旅 · 8天7夜 · September 2026 — a day-by-day itinerary covering pandas, temples, food, and culture in Chengdu, China.",
    keywords: ["Chengdu itinerary", "Chengdu travel guide", "8 day Chengdu trip", "成都旅游攻略", "September 2026 Chengdu"],
    path: "/trip/chengdu-sep-2026",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: "Chengdu Explorer's Journey",
      description: "8-day, 7-night itinerary through Chengdu, China: pandas, temples, food, and culture.",
      url: `${SITE_URL}/trip/chengdu-sep-2026`,
      provider: { "@type": "Person", name: "Winston" },
    },
  },
} as const satisfies Record<string, PageSeo>;

// ── Next.js <Metadata> builder ────────────────────────────────────────────────
// Converts one SEO entry into the shape app/**/page.tsx's `metadata` export
// wants — keeps that conversion logic in one place instead of repeating it
// per page. Leaving title/description undefined lets Next inherit the
// site-wide default from layout.tsx instead of rendering something blank;
// leaving keywords/path empty just omits that tag rather than rendering an
// empty or incorrect one.
export function toMetadata(page: PageSeo) {
  return {
    title: page.title || undefined,
    description: page.description || undefined,
    keywords: page.keywords?.length ? page.keywords : undefined,
    alternates: page.path ? { canonical: `${SITE_URL}${page.path}` } : undefined,
  };
}
