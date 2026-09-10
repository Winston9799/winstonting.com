// ─── JSON-LD STRUCTURED DATA ──────────────────────────────────────────────────
// Renders one page's schema.org JSON-LD block (see src/lib/seo.ts for the
// actual data). Safe to use in both server and client component trees.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
