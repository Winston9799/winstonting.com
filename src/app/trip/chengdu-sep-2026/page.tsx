// Thin server wrapper so this route can export page <Metadata> and JSON-LD —
// the actual itinerary UI lives in ../ChengduTrip.tsx, which needs
// "use client" for state.
import { SEO, toMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ChengduTrip from "../ChengduTrip";

export const metadata = toMetadata(SEO.chengduTrip);

export default function ChengduTripPage() {
  return (
    <>
      <JsonLd data={SEO.chengduTrip.jsonLd} />
      <ChengduTrip />
    </>
  );
}
