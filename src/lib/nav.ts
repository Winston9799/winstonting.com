// ─── SINGLE SOURCE OF TRUTH ──────────────────────────────────────────────────
// Edit this file to update BOTH the header navigation AND the footer sitemap.
// Add a new NavItem → it appears in the menu and auto-populates the footer.
// ─────────────────────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  desc?: string; // optional subtitle shown in mega-menu
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href?: string;      // direct link (no mega-menu)
  columns?: NavColumn[]; // triggers mega-menu dropdown
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
        heading: "成都探索之旅 2026",
        links: [
          { label: "行程概览", href: "/trip#overview", desc: "8天行程总览" },
          { label: "每日行程", href: "/trip#itinerary", desc: "Day by Day 详细安排" },
          { label: "景点", href: "/trip#attractions", desc: "12个精选景点" },
          { label: "住宿", href: "/trip#hotel", desc: "JW万豪酒店 · 7晚" },
        ],
      },
      {
        heading: "景点精选",
        links: [
          { label: "大熊猫基地", href: "/trip#panda" },
          { label: "武侯祠 & 锦里", href: "/trip#wuhouci" },
          { label: "都江堰 & 青城山", href: "/trip#dujiangyan" },
          { label: "三星堆博物馆", href: "/trip#sanxingdui" },
          { label: "黄龙溪古镇", href: "/trip#huanglongxi" },
        ],
      },
    ],
  },
  {
    label: "Contact Me",
    href: "/contact",
  },
];
