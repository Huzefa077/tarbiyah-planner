import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Hero() {
  // The same server-side helper used by Navbar tells us whether this visitor is logged in.
  const user = await getCurrentUser();
  const firstName = user?.fullName.trim().split(/\s+/)[0];

  return (
    <section className="flex min-h-[calc(100svh-57px)] w-full max-w-2xl flex-col items-center justify-center text-center">
      {/* The hero fills the space below the navbar; the workflow begins after scrolling. */}
      <h1 className="text-4xl font-bold sm:text-5xl">
        Tarbiyah Planner
      </h1>

      <p className="mt-6 text-base text-gray-600 sm:text-lg">
        Help your child build good habits, strong character, and confidence through simple daily routines.
      </p>

      <div className="mt-10">
        {user ? (
          // Logged-in visitors should continue their work instead of being offered account entry again.
          <div className="flex flex-col items-center gap-3">
            {firstName && (
              <p className="text-lg font-medium text-primary">
                Hello, {firstName}
              </p>
            )}

            <Link href="/dashboard">
              <Button>
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* Account actions stay together because they are the main, permanent paths. */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button>
                  Sign up
                </Button>
              </Link>

              <Link href="/login">
                <Button variant="outline">
                  Sign in
                </Button>
              </Link>
            </div>

            {/* Guests can build, preview, and print a planner without an account. */}
            <Link href="/planner">
              <Button size="lg" variant="outline">
                Try as Guest
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
