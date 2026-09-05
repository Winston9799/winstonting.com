// Thin server wrapper so this route can export page <Metadata> — the actual
// itinerary UI lives in ../ChengduTrip.tsx, which needs "use client" for state.
import type { Metadata } from "next";
import ChengduTrip from "../ChengduTrip";

export const metadata: Metadata = {
  title: "Chengdu Sep 2026",
  description: "成都探索之旅 · 8天7夜 · September 2026",
};

export default function ChengduTripPage() {
  return <ChengduTrip />;
}
