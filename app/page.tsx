// ROUTE: / — the public landing page; it composes reusable Hero and Features sections.
// Import the two reusable sections displayed on the home page.
import Hero from "@/components/common/Hero";
import Features from "@/components/common/Features";

// A default export from app/page.tsx is the page Next.js shows at the URL: /
export default function Home() {
  return (
    // This is the page's main content area.
    // min-h-screen fills at least the full browser height.
    // flex flex-col stacks Hero and Features vertically.
    // items-center centers both sections horizontally; px-6 adds side space.
    <main className="min-h-screen flex flex-col items-center px-6">
      {/* The introductory title, description, and action links. */}
      <Hero />

      {/* The grid of reasons/features shown below the hero section. */}
      <Features />
    </main>
  );
}
