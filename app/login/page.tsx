"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();

    // Store the values entered by the user.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Used while the login request is running.
    const [isLoading, setIsLoading] = useState(false);

    // Stores an error returned by the backend.
    const [error, setError] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        // Clear any previous error.
        setError("");

        setIsLoading(true);

        try {
            /*
            Send the login data to our backend.

            POST /api/auth/login
            */
            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            // Read the JSON response from the API.
            const data = await response.json();

            /*
            If login failed, display the message returned
            by the backend.
            */
            if (!response.ok) {
                setError(
                    data.message ||
                        "Login failed."
                );

                return;
            }

            /*
            Login succeeded.

            The backend has already stored the JWT in the
            HTTP-only auth_token cookie.

            We don't manually store the token in React,
            localStorage, or sessionStorage.
            */

            // Send the authenticated user to the dashboard.
            router.push("/dashboard");

            // Refresh the route so server-side code can
            // immediately see the new authentication cookie.
            router.refresh();

        } catch (error) {

            /*
            This catches network errors where the browser
            could not reach the API at all.
            */
            console.error(
                "Login request failed:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                <h1 className="text-3xl font-bold text-center">
                    Login
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Welcome back!
                </p>

                <form
                    className="mt-8 space-y-5"
                    onSubmit={handleSubmit}
                >

                    {/* Email */}
                    <div>
                        <label className="font-medium">
                            Email
                        </label>

                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="font-medium">
                            Password
                        </label>

                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Logging in..."
                            : "Login"}
                    </Button>

                </form>

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