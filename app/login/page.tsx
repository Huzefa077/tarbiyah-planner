// Reusable styled form controls from the project's UI component folder.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Next.js Link navigates to another route without a full page reload.
import Link from "next/link";

// This default export is the page Next.js renders for the /login URL.
export default function RegisterPage() {
    return (
        // Full-height page that centres the white form card on a light-gray background.
        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            {/* w-full helps the card fit small screens; max-w-md limits its width on large screens. */}
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                {/* The page heading and its supporting text. */}
                <h1 className="text-3xl font-bold text-center">
                    Login
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Welcome back!
                </p>

                {/* The form layout: space-y-5 adds vertical space between its direct children.
            It only displays fields for now; it does not submit data yet. */}
                <form className="mt-8 space-y-5">

                    {/* Email input: type=email lets the browser validate an email-shaped value. */}
                    <div>
                        <label className="font-medium">
                            Email
                        </label>

                        <Input
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password input: type=password hides the characters a user enters. */}
                    <div>
                        <label className="font-medium">
                            Password
                        </label>

                        <Input
                            type="password"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* w-full makes this reusable Button span the available card width. */}
                    <Button className="w-full">
                        Login
                    </Button>

                </form>

                {/* Text shown below the form. {" "} inserts one explicit space before the Link. */}
                <p className="text-center text-sm mt-6">
          Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-blue-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </main>
    );
}
