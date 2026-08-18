import type { Metadata } from "next";
import { SOCIALS } from "@/lib/socials";

export const metadata: Metadata = {
  title: "Contact Me",
};

// ─── EDIT CONTACT DETAILS ──────────────────────────────────────────────────
const CONTACT_EMAIL   = "your@email.com";     // replace with your email
const CONTACT_HEADING = "Get in Touch";
const CONTACT_SUBTEXT = "Drop me a message, follow along, or just say hi.";
// ──────────────────────────────────────────────────────────────────────────

// Social icon SVGs (same set as SiteFooter)
function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "instagram":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactPage() {
  return (
    <div className="max-w-screen-lg mx-auto px-8 py-12">

      {/* ── Page header ── */}
      <div className="mb-12">
        <span className="text-[10px] tracking-[3px] uppercase text-[var(--muted)] font-medium">
          Get in Touch
        </span>
        <h1 className="mt-3 text-4xl font-bold text-[var(--foreground)] leading-tight">
          {CONTACT_HEADING}
        </h1>
        <p className="mt-2 text-[var(--muted)]">{CONTACT_SUBTEXT}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

        {/* ── Contact form ── */}
        <div className="lg:col-span-3">
          {/* NOTE: This form uses mailto for now. To handle submissions properly,
              wire it up to Formspree (https://formspree.io) or a server action. */}
          <form
            action={`mailto:${CONTACT_EMAIL}`}
            method="GET"
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-medium text-[var(--foreground)] mb-1.5 tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="w-full border border-[var(--border)] rounded-lg px-4 py-3 text-[14px] text-[var(--foreground)] bg-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[var(--foreground)] mb-1.5 tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  className="w-full border border-[var(--border)] rounded-lg px-4 py-3 text-[14px] text-[var(--foreground)] bg-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[var(--foreground)] mb-1.5 tracking-wide">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="What's this about?"
                className="w-full border border-[var(--border)] rounded-lg px-4 py-3 text-[14px] text-[var(--foreground)] bg-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[var(--foreground)] mb-1.5 tracking-wide">
                Message
              </label>
              <textarea
                name="body"
                rows={6}
                placeholder="Write your message here…"
                required
                className="w-full border border-[var(--border)] rounded-lg px-4 py-3 text-[14px] text-[var(--foreground)] bg-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-[var(--foreground)] text-white text-[13px] font-semibold rounded-full hover:bg-[var(--accent)] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* ── Sidebar: email + socials ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Email */}
          <div>
            <p className="text-[10px] font-semibold tracking-[2px] uppercase text-[var(--muted)] mb-3">
              Email
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[15px] font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Social links */}
          <div>
            <p className="text-[10px] font-semibold tracking-[2px] uppercase text-[var(--muted)] mb-4">
              Follow Me
            </p>
            <div className="space-y-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[14px] text-[var(--foreground)] hover:text-[var(--accent)] transition-colors group"
                >
                  <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                    <SocialIcon icon={s.icon} />
                  </span>
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
