import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Me",
};

export default function ContactPage() {
  return <ContactClient />;
}
