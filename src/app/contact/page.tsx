import { SEO, toMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ContactClient from "./ContactClient";

export const metadata = toMetadata(SEO.contact);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={SEO.contact.jsonLd} />
      <ContactClient />
    </>
  );
}
