import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

// This server component appears in the root layout, so it is available on every page.
export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="no-print border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* The app name always leads back to the landing page. */}
        <Link href="/" className="font-fredoka text-xl font-semibold text-primary">
          Tarbiyah Planner
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* These are the useful direct destinations after a user signs in. */}
              <Link
                href="/dashboard"
                className="px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-950"
              >
                Dashboard
              </Link>

              <Button
                size="sm"
                render={<Link href="/planner" />}
                nativeButton={false}
              >
                New Planner
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-950"
              >
                Login
              </Link>

              <Button
                size="sm"
                render={<Link href="/register" />}
                nativeButton={false}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
