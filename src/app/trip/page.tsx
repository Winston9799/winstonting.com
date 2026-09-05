import { redirect } from "next/navigation";

// /trip has no index of its own yet — send visitors straight to the one
// itinerary that exists. Add a real listing here if a second trip is added.
export default function TripPage() {
  redirect("/trip/chengdu-sep-2026");
}
