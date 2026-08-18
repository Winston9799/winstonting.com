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
          { label: "Chengdu Sep 2026", href: "/trip", desc: "成都探索之旅 · 8天7夜" },
        ],
      },
      {
        heading: "景点精选",
        links: [
          { label: "大熊猫基地", href: "/trip#day-2" },
          { label: "武侯祠 & 锦里", href: "/trip#day-5" },
          { label: "都江堰 & 青城山", href: "/trip#day-4" },
          { label: "三星堆博物馆", href: "/trip#day-6" },
          { label: "黄龙溪古镇", href: "/trip#day-5" },
        ],
      },
    ],
  },
  {
    label: "Contact Me",
    href: "/contact",
  },
];
