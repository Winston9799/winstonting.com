"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { NAV, NavItem } from "@/lib/nav";

// ─── EDIT SITE IDENTITY ───────────────────────────────────────────────────────
const SITE_NAME     = "Winston";
const SITE_TAGLINE  = "Travels";   // shown next to the name in smaller weight
// ─────────────────────────────────────────────────────────────────────────────

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconHamburger({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {open ? (
        <>
          <path d="M18 6 6 18" /><path d="M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

// ── Desktop mega-menu panel ───────────────────────────────────────────────────
function MegaMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  if (!item.columns) return null;
  return (
    <>
      {/* dim overlay */}
      <div
        className="fixed inset-0 top-[56px] bg-black/40 z-30"
        onClick={onClose}
      />
      {/* panel */}
      <div className="absolute left-0 right-0 top-full bg-white shadow-xl border-t border-[var(--border)] z-40">
        <div className="max-w-screen-lg mx-auto px-8 py-10 grid gap-10"
          style={{ gridTemplateColumns: `repeat(${item.columns.length}, minmax(0,1fr))` }}>
          {item.columns.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-semibold tracking-[2px] uppercase text-[var(--muted)] mb-4">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block group"
                    >
                      <span className="text-[14px] text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors font-medium leading-tight">
                        {link.label}
                      </span>
                      {link.desc && (
                        <span className="block text-[11px] text-[var(--muted)] mt-0.5">
                          {link.desc}
                        </span>
                      )}
                    </Link>
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

// ── Mobile drawer ─────────────────────────────────────────────────────────────
function MobileDrawer({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 top-[56px] bg-white z-40 overflow-y-auto">
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
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="block px-2 py-1.5 text-[14px] text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href ?? "/"}
                onClick={onClose}
                className="block py-4 text-[15px] font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

// ── Main SiteHeader ───────────────────────────────────────────────────────────
export default function SiteHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeItem = NAV.find((n) => n.label === activeMenu);

  return (
    <>
      <header
        ref={navRef}
        className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}
        style={{ height: "56px" }}
      >
        <div className="h-full max-w-screen-lg mx-auto px-6 flex items-center justify-between gap-8">

          {/* ── Logo ── */}
          <Link href="https://winstonting.com" className="shrink-0" onClick={() => { setActiveMenu(null); setMobileOpen(false); }}>
            <span className="text-[18px] font-bold tracking-tight text-[var(--foreground)]">{SITE_NAME}</span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV.map((item) => (
              <div key={item.label} className="relative">
                {item.columns ? (
                  <button
                    onMouseEnter={() => setActiveMenu(item.label)}
                    onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                    className={`px-4 h-[56px] flex items-center gap-1 text-[13px] font-medium transition-colors border-b-2 ${
                      activeMenu === item.label
                        ? "border-[var(--foreground)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--foreground)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {item.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className={`transition-transform ${activeMenu === item.label ? "rotate-180" : ""}`}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href ?? "/"}
                    onMouseEnter={() => setActiveMenu(null)}
                    className="px-4 h-[56px] flex items-center text-[13px] font-medium text-[var(--foreground)] hover:text-[var(--accent)] border-b-2 border-transparent transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* ── Right icons ── */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-full hover:bg-[var(--surface)]">
              <IconSearch />
            </button>
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

        {/* ── Desktop mega-menu ── */}
        {activeMenu && activeItem?.columns && (
          <div onMouseLeave={() => setActiveMenu(null)}>
            <MegaMenu item={activeItem} onClose={() => setActiveMenu(null)} />
          </div>
        )}
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && <MobileDrawer onClose={() => setMobileOpen(false)} />}
    </>
  );
}
