// ─── SINGLE SOURCE OF TRUTH ──────────────────────────────────────────────────
// Edit here → updates BOTH the header mega-menu AND the footer sitemap.
// ─────────────────────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  desc?: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href?: string;
  columns?: NavColumn[];
}

export const NAV: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Trip",
    columns: [
      {
        heading: "我的行程",
        links: [
          { label: "Chengdu Sep 2026", href: "/trip/chengdu-sep-2026", desc: "成都探索之旅 · 8天7夜" },
        ],
      },
    ],
  },
  {
    label: "Contact Me",
    href: "/contact",
  },
];
