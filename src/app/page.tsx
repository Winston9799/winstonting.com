// Thin server wrapper so this route can export page <Metadata> and JSON-LD —
// the actual homepage UI lives in ./HomeClient.tsx, which needs "use client"
// for state (image-fallback handling).
import { SEO, toMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import HomeClient from "./HomeClient";

export const metadata = toMetadata(SEO.home);

export default function HomePage() {
  return (
    <>
      <JsonLd data={SEO.home.jsonLd} />
      <HomeClient />
    </>
  );
}
