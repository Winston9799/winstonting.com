// ─── EDIT YOUR SOCIAL LINKS HERE ─────────────────────────────────────────────
// These appear in the Footer and Contact page.
// Set href to "#" to leave a placeholder, or paste your full profile URL.
// To hide a platform, delete its entry from the array.
// ─────────────────────────────────────────────────────────────────────────────

export interface Social {
  name: string;
  href: string;
  icon: "instagram" | "facebook" | "linkedin" | "youtube" | "tiktok" | "x";
}

export const SOCIALS: Social[] = [
  { name: "Instagram", href: "#", icon: "instagram" },
  { name: "Facebook",  href: "#", icon: "facebook"  },
  { name: "LinkedIn",  href: "#", icon: "linkedin"  },
  { name: "YouTube",   href: "#", icon: "youtube"   },
  { name: "TikTok",    href: "#", icon: "tiktok"    },
];
