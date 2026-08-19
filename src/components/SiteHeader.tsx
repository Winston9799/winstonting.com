"use client";

import { useState, useRef, useEffect } from "react";
import { NAV, NavItem } from "@/lib/nav";

// ─── EDIT SITE IDENTITY ───────────────────────────────────────────────────────
const SITE_NAME = "Winston";
// ─────────────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

function MegaMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  if (!item.columns) return null;
  return (
    <>
      <div className="fixed inset-0 top-[72px] bg-black/30 z-30" onClick={onClose} />
      <div className="absolute left-3 right-3 top-full mt-1.5 bg-white/90 backdrop-blur-xl shadow-xl border border-black/[0.06] rounded-2xl z-40 overflow-hidden">
        <div className="max-w-screen-lg mx-auto px-8 py-8 grid gap-10"
          style={{ gridTemplateColumns: `repeat(${item.columns.length}, minmax(0,1fr))` }}>
          {item.columns.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-semibold tracking-[2px] uppercase text-[var(--muted)] mb-4">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} onClick={onClose} className="block group">
                      <span className="text-[14px] text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors font-medium leading-tight">
                        {link.label}
                      </span>
                      {link.desc && (
                        <span className="block text-[11px] text-[var(--muted)] mt-0.5">{link.desc}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 top-[72px] bg-white z-40 overflow-y-auto">
      <nav className="max-w-screen-lg mx-auto px-6 py-4">
        {NAV.map((item) => (
          <div key={item.label} className="border-b border-[var(--border)]">
            {item.columns ? (
              <>
                <button
                  onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between py-4 text-[15px] font-medium text-[var(--foreground)]"
                >
                  {item.label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`transition-transform ${expanded === item.label ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {expanded === item.label && (
                  <div className="pb-4 space-y-5">
                    {item.columns.map((col) => (
                      <div key={col.heading}>
                        <p className="text-[10px] font-semibold tracking-[2px] uppercase text-[var(--muted)] mb-2 px-2">
                          {col.heading}
                        </p>
                        {col.links.map((link) => (
                          <a key={link.href} href={link.href} onClick={onClose}
                            className="block px-2 py-1.5 text-[14px] text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
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
                className="block py-4 text-[15px] font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
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
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <header ref={navRef} className="sticky top-0 z-50 pt-2.5 px-3">

        {/* ── Glass bar ── */}
        <div className={`rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "bg-white/25 backdrop-blur-2xl border-white/30 shadow-lg"
            : "bg-white/10 backdrop-blur-xl border-white/15 shadow-sm"
        }`}>
          <div className="max-w-screen-lg mx-auto px-5 flex items-center justify-between gap-6" style={{ height: "56px" }}>

            {/* Logo */}
            <a href="/" className="shrink-0 flex items-center">
              <span className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">{SITE_NAME}</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center flex-1">
              {NAV.map((item) => (
                <div key={item.label} className="relative flex items-center">
                  {item.columns ? (
                    <button
                      onMouseEnter={() => setActiveMenu(item.label)}
                      onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                      className={`px-4 h-[56px] flex items-center gap-1 text-[15px] font-medium transition-colors ${
                        activeMenu === item.label
                          ? "text-[var(--accent)]"
                          : "text-[var(--foreground)] hover:text-[var(--accent)]"
                      }`}
                    >
                      {item.label}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`transition-transform ${activeMenu === item.label ? "rotate-180" : ""}`}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  ) : (
                    <a href={item.href ?? "/"} onMouseEnter={() => setActiveMenu(null)}
                      className="px-4 h-[56px] flex items-center text-[15px] font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </nav>

            {/* Search bar + mobile hamburger */}
            <div className="flex items-center gap-2">
              {/* Desktop search bar */}
              <div className="hidden md:flex items-center gap-2 bg-white/40 rounded-full px-3 h-8 border border-white/50 text-[var(--muted)] focus-within:border-[var(--accent)] focus-within:bg-white/60 transition-all">
                <IconSearch />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none text-[14px] text-[var(--foreground)] placeholder:text-[var(--muted)] w-24 focus:w-36 transition-[width] duration-200"
                />
              </div>
              {/* Mobile hamburger */}
              <button
                className="flex md:hidden p-2 text-[var(--foreground)] rounded-full hover:bg-[var(--surface)] transition-colors"
                onClick={() => { setMobileOpen((v) => !v); setActiveMenu(null); }}
                aria-label="Toggle menu"
              >
                <IconHamburger open={mobileOpen} />
              </button>
            </div>

          </div>
        </div>

        {/* Desktop mega-menu */}
        {activeMenu && activeItem?.columns && (
          <div onMouseLeave={() => setActiveMenu(null)}>
            <MegaMenu item={activeItem} onClose={() => setActiveMenu(null)} />
          </div>
        )}

      </header>

      {mobileOpen && <MobileDrawer onClose={() => setMobileOpen(false)} />}
    </>
  );
}
