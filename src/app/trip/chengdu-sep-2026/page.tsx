import type { Metadata } from "next";
import ChengduTrip from "../ChengduTrip";

export const metadata: Metadata = {
  title: "Chengdu Sep 2026",
  description: "成都探索之旅 · 8天7夜 · September 2026",
};

export default function ChengduTripPage() {
  return <ChengduTrip />;
}
