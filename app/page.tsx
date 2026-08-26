// ROUTE: / — the public landing page; it composes reusable Hero and Features sections.
// Import the two reusable sections displayed on the home page.
import Hero from "@/components/common/Hero";
import Features from "@/components/common/Features";

// A default export from app/page.tsx is the page Next.js shows at the URL: /
export default function Home() {
  return (
    // This is the page's main content area.
    // Hero and Features are stacked; each section controls its own responsive width and spacing.
    <main className="min-h-screen">
      {/* The introductory title, description, and action links. */}
      <Hero />

      {/* The grid of reasons/features shown below the hero section. */}
      <Features />
    </main>
  );
}
