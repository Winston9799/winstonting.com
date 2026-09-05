"use client";

import { useRef, useState } from "react";
import { SOCIALS } from "@/lib/socials";

// ─── EDIT CONTACT DETAILS ──────────────────────────────────────────────────
const CONTACT_EMAIL   = "your@email.com";     // replace with your email
const CONTACT_HEADING = "Get in Touch";
const CONTACT_SUBTEXT = "Drop me a message, follow along, or just say hi.";
const MIN_MESSAGE_LENGTH = 100;
// ──────────────────────────────────────────────────────────────────────────

// Social icon SVGs (same set as SiteFooter)
function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "instagram":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    default:
      return null;
  }
}

const inputBase =
  "w-full bg-[#16171d] border text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:ring-1";

function fieldClasses(hasError: boolean, shaking: boolean) {
  return [
    inputBase,
    hasError
      ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/30"
      : "border-zinc-800 focus:border-[#d4a017] focus:ring-[#d4a017]/30",
    shaking ? "shake-error" : "",
  ].join(" ");
}

export default function ContactClient() {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [shake, setShake] = useState<{ name?: boolean; subject?: boolean; message?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  function triggerShake(field: "name" | "subject" | "message") {
    setShake((s) => ({ ...s, [field]: true }));
    setTimeout(() => setShake((s) => ({ ...s, [field]: false })), 450);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nameVal = nameRef.current?.value.trim() ?? "";
    const emailVal = emailRef.current?.value.trim() ?? "";
    const subjectVal = subjectRef.current?.value.trim() ?? "";
    const messageVal = messageRef.current?.value.trim() ?? "";

    let hasError = false;
    let firstInvalid: HTMLElement | null = null;

    if (!nameVal) {
      setNameError("Please enter your name.");
      triggerShake("name");
      hasError = true;
      firstInvalid ??= nameRef.current;
    } else {
      setNameError(null);
    }

    if (!subjectVal) {
      setSubjectError("Please enter a subject.");
      triggerShake("subject");
      hasError = true;
      firstInvalid ??= subjectRef.current;
    } else {
      setSubjectError(null);
    }

    if (!messageVal) {
      setMessageError(`Please enter your message (at least ${MIN_MESSAGE_LENGTH} characters).`);
      triggerShake("message");
      hasError = true;
      firstInvalid ??= messageRef.current;
    } else if (messageVal.length < MIN_MESSAGE_LENGTH) {
      const remaining = MIN_MESSAGE_LENGTH - messageVal.length;
      setMessageError(`Message must be at least ${MIN_MESSAGE_LENGTH} characters (${remaining} more needed).`);
      triggerShake("message");
      hasError = true;
      firstInvalid ??= messageRef.current;
    } else {
      setMessageError(null);
    }

    if (hasError) {
      firstInvalid?.focus();
      return;
    }

    const mailSubject = encodeURIComponent(`${subjectVal} — from ${nameVal}`);
    const mailBody = encodeURIComponent(`${messageVal}${emailVal ? `\n\n— ${nameVal} (${emailVal})` : `\n\n— ${nameVal}`}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

    setSubmitted(true);
    setSent(true);
    setTimeout(() => {
      formRef.current?.reset();
      setSent(false);
    }, 3000);
  }

  return (
    <div className="relative bg-[#0c0d10] min-h-screen overflow-hidden">
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%", right: "15%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(212,160,23,0.045) 0%, rgba(12,13,16,0) 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "20%", left: "5%", width: 450, height: 450,
          background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(12,13,16,0) 70%)",
        }}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {CONTACT_HEADING}
          </h1>
          <p className="text-base md:text-lg text-zinc-400 font-light">{CONTACT_SUBTEXT}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* ── Contact form ── */}
          <div className="lg:col-span-7 relative">
            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-[#1b2519] border border-zinc-700/80 text-emerald-300 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 text-[#d4a017] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
                <div>
                  <p className="font-medium text-white">Thanks! Your email app should have opened.</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Send it from there and I&rsquo;ll get back to you as soon as possible.</p>
                </div>
              </div>
            )}

            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2" htmlFor="name">
                    Name <span className="text-[#d4a017] font-semibold" title="Required">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className={fieldClasses(!!nameError, !!shake.name)}
                    onChange={() => setNameError(null)}
                  />
                  {nameError && <p className="text-xs text-rose-400 mt-1.5">{nameError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className={fieldClasses(false, false)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2" htmlFor="subject">
                  Subject <span className="text-[#d4a017] font-semibold" title="Required">*</span>
                </label>
                <input
                  ref={subjectRef}
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What&rsquo;s this about?"
                  className={fieldClasses(!!subjectError, !!shake.subject)}
                  onChange={() => setSubjectError(null)}
                />
                {subjectError && <p className="text-xs text-rose-400 mt-1.5">{subjectError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2" htmlFor="message">
                  Message <span className="text-[#d4a017] font-semibold" title="Required">*</span>
                </label>
                <div className="relative">
                  <textarea
                    ref={messageRef}
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Write your message here..."
                    className={`${fieldClasses(!!messageError, !!shake.message)} resize-none block p-4`}
                    onChange={() => setMessageError(null)}
                  />
                  {messageError && (
                    <div
                      className="absolute inset-0 pointer-events-none flex items-center justify-center p-4"
                      onClick={() => { setMessageError(null); messageRef.current?.focus(); }}
                    >
                      <div className="bg-[#1b1214]/90 border border-rose-500/50 backdrop-blur-sm rounded-lg px-4 py-2.5 text-center shadow-lg pointer-events-auto flex items-center gap-2">
                        <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                        <span className="text-rose-400 text-xs md:text-sm font-medium">{messageError}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center font-medium text-sm px-8 py-3.5 rounded-full border border-zinc-700/80 bg-[#16171d] text-white hover:bg-[#d4a017] hover:text-black hover:border-[#d4a017] shadow-md hover:shadow-[0_0_24px_rgba(212,160,23,0.35)] transition-all duration-300 cursor-pointer disabled:opacity-70"
                  disabled={sent}
                >
                  {sent ? "Sent ✓" : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          {/* ── Sidebar: email + socials ── */}
          <div className="lg:col-span-5 lg:pl-10 space-y-10">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
                Email
              </span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[15px] font-medium text-white hover:text-[#d4a017] transition-colors break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-5">
                Follow Me
              </span>
              <div className="flex items-center gap-4 pt-1">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="group flex items-center justify-center w-10 h-10 rounded-xl bg-[#16171d] border border-zinc-800 text-zinc-400 hover:text-[#d4a017] hover:border-[#d4a017] transition-all duration-200"
                  >
                    <span className="transition-transform duration-200 group-hover:scale-110">
                      <SocialIcon icon={s.icon} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        :global(.shake-error) {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
