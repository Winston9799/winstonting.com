"use client";

import { useState, useRef, useEffect } from "react";

// ─── EDIT YOUR MENU STRUCTURE HERE ───────────────────────────────────────────
// href is optional — omit it for section headers that only open submenus.
// Add as many levels of `children` as you need (3 levels supported).
const NAV_ITEMS: MenuItem[] = [
  {
    label: "行程概览",
    href: "#overview",
  },
  {
    label: "每日行程",
    children: [
      { label: "Day 1 · 出发 · 新加坡", href: "#day-1" },
      { label: "Day 2 · 抵达 · 成都", href: "#day-2" },
      { label: "Day 3 · 大熊猫 · 东郊记忆", href: "#day-3" },
      { label: "Day 4 · IFS · 成都博物馆", href: "#day-4" },
      { label: "Day 5 · 都江堰 · 青城山", href: "#day-5" },
      { label: "Day 6 · 武侯祠 · 三星堆", href: "#day-6" },
      { label: "Day 7 · 宽窄巷子 · Citywalk", href: "#day-7" },
      { label: "Day 8 · 自由 · 返程", href: "#day-8" },
    ],
  },
  {
    label: "景点",
    children: [
      {
        label: "自然 & 古镇",
        children: [
          { label: "都江堰", href: "#dujiangyan" },
          { label: "青城山", href: "#qingcheng" },
          { label: "黄龙溪古镇", href: "#huanglongxi" },
        ],
      },
      {
        label: "文化 & 历史",
        children: [
          { label: "武侯祠 & 锦里", href: "#wuhouci" },
          { label: "杜甫草堂", href: "#dufu" },
          { label: "三星堆博物馆", href: "#sanxingdui" },
          { label: "成都博物馆", href: "#museum" },
        ],
      },
      {
        label: "休闲 & 购物",
        children: [
          { label: "成都SKP", href: "#skp" },
          { label: "IFS · 太古里", href: "#ifs" },
          { label: "宽窄巷子", href: "#kuanzhai" },
          { label: "东郊记忆", href: "#dongjiaojiyi" },
        ],
      },
    ],
  },
  {
    label: "住宿",
    children: [
      { label: "Pagoda Design Hotel", href: "#hotel" },
      { label: "房间详情", href: "#hotel-room" },
      { label: "周边地图", href: "#hotel-map" },
    ],
  },
  {
    label: "实用信息",
    children: [
      { label: "航班信息", href: "#flights" },
      { label: "天气 & 穿搭", href: "#weather" },
      { label: "常用中文", href: "#phrases" },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  href?: string;
  children?: MenuItem[];
}

// ── Desktop: third-level flyout (appears to the right of the parent) ──────────
function FlyoutMenu({ items }: { items: MenuItem[] }) {
  return (
    <ul className="absolute left-full top-0 ml-1 min-w-[160px] bg-[var(--ink)] border border-white/10 rounded shadow-xl z-50 py-1 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-150">
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href ?? "#"}
            className="block px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

// ── Desktop: second-level dropdown ────────────────────────────────────────────
function DropdownMenu({ items }: { items: MenuItem[] }) {
  return (
    <ul className="absolute top-full left-0 mt-1 min-w-[180px] bg-[var(--ink)] border border-white/10 rounded shadow-xl z-40 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
      {items.map((item) => (
        <li key={item.label} className="relative group/sub">
          {item.children ? (
            <>
              <button className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                <span>{item.label}</span>
                <span className="text-white/30 text-[9px]">▶</span>
              </button>
              <FlyoutMenu items={item.children} />
            </>
          ) : (
            <a
              href={item.href ?? "#"}
              className="block px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

// ── Mobile: recursive accordion item ─────────────────────────────────────────
function MobileItem({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
  const [open, setOpen] = useState(false);
  const indent = depth * 12;

  return (
    <li>
      {item.children ? (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between py-3 text-sm text-white/80 hover:text-white transition-colors"
            style={{ paddingLeft: `${indent}px` }}
          >
            <span className={depth === 0 ? "font-medium" : "font-normal text-white/60"}>
              {item.label}
            </span>
            <span className={`text-white/30 text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          {open && (
            <ul className="border-l border-white/10 ml-3 pl-2">
              {item.children.map((child) => (
                <MobileItem key={child.label} item={child} depth={depth + 1} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <a
          href={item.href ?? "#"}
          className="block py-2.5 text-sm hover:text-white transition-colors"
          style={{ paddingLeft: `${indent}px`, color: depth === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)" }}
        >
          {item.label}
        </a>
      )}
      <div className="h-px bg-white/5" />
    </li>
  );
}

// ── Main NavMenu component ────────────────────────────────────────────────────
export default function NavMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close mobile menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav ref={menuRef} className="bg-[var(--ink)] border-t border-white/10 sticky top-0 z-30">
      <div className="max-w-2xl mx-auto px-6 flex items-center h-11">

        {/* ── Desktop nav ── */}
        <ul className="hidden md:flex items-center gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="relative group">
              {item.children ? (
                <>
                  <button className="flex items-center gap-1 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors rounded">
                    {item.label}
                    <span className="text-[9px] text-white/30">▾</span>
                  </button>
                  <DropdownMenu items={item.children} />
                </>
              ) : (
                <a
                  href={item.href ?? "#"}
                  className="block px-3 py-2 text-xs text-white/60 hover:text-white transition-colors rounded"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* ── Mobile hamburger ── */}
        <div className="flex md:hidden items-center justify-between w-full">
          <span className="text-xs text-white/40 tracking-widest font-sans">导航</span>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex flex-col gap-[5px] p-2 group"
          >
            <span className={`block w-5 h-px bg-white/60 transition-all origin-center ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block w-5 h-px bg-white/60 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-white/60 transition-all origin-center ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[var(--ink)]">
          <ul className="max-w-2xl mx-auto px-6 py-2">
            {NAV_ITEMS.map((item) => (
              <MobileItem key={item.label} item={item} depth={0} />
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
