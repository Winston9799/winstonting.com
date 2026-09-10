// ─── JSON-LD STRUCTURED DATA ──────────────────────────────────────────────────
// Renders one page's schema.org JSON-LD block (see src/lib/seo.ts for the
// actual data). Safe to use in both server and client component trees.
// Renders nothing if data is left out or empty, rather than emitting a
// meaningless empty <script> tag.
export default function JsonLd({ data }: { data?: Record<string, unknown> }) {
  if (!data || Object.keys(data).length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
