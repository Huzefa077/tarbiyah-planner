import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import ThemeToggle from "@/components/common/ThemeToggle";

// This server component appears in the root layout, so it is available on every page.
export default async function Navbar() {
  const user = await getCurrentUser();

  // sticky keeps this header in normal page layout, then pins it at the viewport top while scrolling.
  return (
    <header className="no-print sticky top-0 z-50 border-b bg-white">
      <nav className="mx-auto grid w-full max-w-[1440px] grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-0.5 sm:grid-cols-[1fr_auto_1fr]">
        {/* The app name always leads back to the landing page. */}
        <Link href="/" className="justify-self-start font-fredoka text-xl font-semibold text-primary">
          Tarbiyah Planner
        </Link>

        {/* The middle grid column stays centred even when left and right content have different widths. */}
        <div className="col-span-2 row-start-2 flex items-center justify-center gap-4 sm:col-span-1 sm:col-start-2 sm:row-start-1">
          {user ? (
            <>
              {/* Dashboard is the primary destination once a user is signed in. */}
              <Link
                href="/dashboard"
                className="text-base font-medium text-gray-600 hover:text-foreground"
              >
                Dashboard
              </Link>
            </>
          ) : null}

          <Link
            href="/about"
            className="text-base font-medium text-gray-600 hover:text-foreground"
          >
            About
          </Link>

          <Link
            href="/feedback"
            className="text-base font-medium text-gray-600 hover:text-foreground"
          >
            Feedback
          </Link>

        </div>

        {/* Theme and account controls stay grouped at the right edge. */}
        <div className="col-start-2 row-start-1 flex items-center gap-4 justify-self-end sm:col-start-3">
          <ThemeToggle />

          {user && (
            <form action="/api/auth/logout" method="POST">
              <Button className="text-sm" size="sm" type="submit" variant="outline">
                Log out
              </Button>
            </form>
          )}

          {!user && (
            <>
              <Link
                href="/login"
                className="text-base font-medium text-gray-600 hover:text-foreground"
              >
                Sign in
              </Link>

              <Button
                size="sm"
                render={<Link href="/register" />}
                nativeButton={false}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
