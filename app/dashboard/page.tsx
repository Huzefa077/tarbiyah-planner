// Import the project's reusable Button component.
import { Button } from "@/components/ui/button";
// Import Next.js Link for navigation to another route.
import Link from "next/link";

// A default export from app/dashboard/page.tsx is displayed at the /dashboard URL.
export default function DashboardPage() {
  return (
    // Page layout:
    // min-h-screen = make this area at least as tall as the browser window.
    // bg-gray-100 = use Tailwind's very light gray background colour.
    // p-8 = add 32px of padding on all four inside edges.
    <main className="min-h-screen bg-gray-100 p-8">

      {/* Content wrapper
          max-w-5xl = do not let this content become wider than Tailwind's 5xl size
          mx-auto = use automatic left/right margins, which centres a limited-width element */}
      <div className="max-w-5xl mx-auto">

        {/* Greeting heading
            text-4xl = use Tailwind's large 4xl font size
            font-bold = use a bold font weight
            The name is hard-coded for now; it will later come from the logged-in user. */}
        <h1 className="text-4xl font-bold">
          Assalamu Alaikum 👋
        </h1>

        {/* Welcome text
            text-gray-600 = use a medium-dark gray text colour
            mt-2 = add 8px of margin above this paragraph */}
        <p className="text-gray-600 mt-2">
          Welcome back, Huzaifa
        </p>

        {/* Action area
            mt-10 = add 40px of margin above this area */}
        <div className="mt-10">

          {/* Clicking this link takes the user to the /planner page. */}
          <Link href="/planner">
            <Button>
              + Create Planner
            </Button>
          </Link>

        </div>

        {/* Recent-planners card
            mt-12 = add 48px of margin above the card
            rounded-xl = give the card noticeably rounded corners
            bg-white = give the card a white background
            shadow = add a subtle shadow around the card
            p-6 = add 24px of padding inside the card
            It currently shows an empty-state message because no data is connected yet. */}
        <div className="mt-12 rounded-xl bg-white shadow p-6">

          {/* Card heading
              text-2xl = use Tailwind's 2xl font size
              font-semibold = use a weight between normal and bold */}
          <h2 className="text-2xl font-semibold">
            Recent Planners
          </h2>

          {/* Empty-state message
              text-gray-500 = use a medium gray text colour
              mt-3 = add 12px of margin above this paragraph */}
          <p className="text-gray-500 mt-3">
            No planners created yet.
          </p>

        </div>

      </div>

    </main>
  );
}
