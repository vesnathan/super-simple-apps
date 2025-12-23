import { DeckPageClient } from "./DeckPageClient";

// Force static generation (no SSR)
export const dynamic = "force-static";

// Required for static export with dynamic routes
// For client-side apps, we generate a single fallback page
// All dynamic routing happens client-side
export async function generateStaticParams() {
  // Return a single placeholder to generate the base page
  // The actual deck rendering happens client-side
  return [{ deckId: "placeholder" }];
}

export default function DeckPage() {
  return <DeckPageClient />;
}
