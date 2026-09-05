"use client";

import { useState, useRef, useEffect } from "react";
import { NAV, NavItem } from "@/lib/nav";

// ─── EDIT SITE IDENTITY ───────────────────────────────────────────────────────
const SITE_NAME = "Winston";
// ─────────────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconHamburger({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {open ? (
        <><path d="M18 6 6 18" /><path d="M6 6l12 12" /></>
      ) : (
        <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>
      )}
    </svg>
  );
}
function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MegaMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  if (!item.columns) return null;
  return (
    <div className="absolute left-0 top-full pt-2 z-40">
      <div className="w-56 py-2 rounded-xl bg-surface border border-white/10 shadow-2xl shadow-black/80 backdrop-blur-xl">
        {item.columns.map((col) => (
          <div key={col.heading} className="px-1 py-1">
            <p className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-[2px] uppercase text-neutral-500">
              {col.heading}
            </p>
            {col.links.map((link) => (
              <a key={link.href} href={link.href} onClick={onClose}
                className="block px-3 py-2 rounded-lg text-[13px] tracking-wide text-neutral-300 hover:text-gold-400 hover:bg-white/5 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 top-20 z-40 overflow-y-auto glass-nav">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        {NAV.map((item) => (
          <div key={item.label} className="border-b border-white/[0.08]">
            {item.columns ? (
              <>
                <button
                  onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between px-2 py-4 rounded-lg text-[15px] font-medium text-white hover:text-gold-400 transition-colors"
                >
                  {item.label}
                  <IconChevron open={expanded === item.label} />
                </button>
                {expanded === item.label && (
                  <div className="pb-4 space-y-5">
                    {item.columns.map((col) => (
                      <div key={col.heading}>
                        <p className="text-[10px] font-semibold tracking-[2px] uppercase text-neutral-500 mb-2 px-2">
                          {col.heading}
                        </p>
                        {col.links.map((link) => (
                          <a key={link.href} href={link.href} onClick={onClose}
                            className="block px-2 py-1.5 rounded-lg text-[14px] text-neutral-300 hover:text-gold-400 hover:bg-white/5 transition-colors">
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <a href={item.href ?? "/"} onClick={onClose}
                className="block px-2 py-4 rounded-lg text-[15px] font-medium text-white hover:text-gold-400 transition-colors">
                {item.label}
              </a>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default function SiteHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setActiveMenu(null);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeItem = NAV.find((n) => n.label === activeMenu);

  return (
    <>
      <header ref={navRef} className="sticky top-0 z-50 glass-nav border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

          {/* Brand & primary nav */}
          <div className="flex items-center space-x-12">
            <a href="/" className="text-xl font-bold tracking-wider text-white hover:text-gold-400 transition-colors">
              {SITE_NAME}
            </a>

            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-300">
              {NAV.map((item) => (
                <div key={item.label} className="relative py-2">
                  {item.columns ? (
                    <>
                      <button
                        onMouseEnter={() => setActiveMenu(item.label)}
                        onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                        className="flex items-center gap-1.5 hover:text-gold-400 transition-colors duration-200 text-neutral-300 focus:outline-none"
                      >
                        {item.label}
                        <IconChevron open={activeMenu === item.label} />
                      </button>
                      {activeMenu === item.label && (
                        <div onMouseLeave={() => setActiveMenu(null)}>
                          <MegaMenu item={item} onClose={() => setActiveMenu(null)} />
                        </div>
                      )}
                    </>
                  ) : (
                    <a href={item.href ?? "/"} onMouseEnter={() => setActiveMenu(null)}
                      className="hover:text-gold-400 transition-colors duration-200">
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Search + mobile hamburger */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="hidden md:flex items-center gap-2.5 text-sm text-neutral-400 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200"
              type="button"
            >
              <IconSearch />
              <span className="text-xs tracking-wide font-normal">Search</span>
            </button>
            <button
              className="flex md:hidden p-2 text-white rounded-full hover:bg-white/5 transition-colors"
              onClick={() => { setMobileOpen((v) => !v); setActiveMenu(null); }}
              aria-label="Toggle menu"
            >
              <IconHamburger open={mobileOpen} />
            </button>
          </div>

        </div>
      </header>

      {mobileOpen && <MobileDrawer onClose={() => setMobileOpen(false)} />}
    </>
  );
}
