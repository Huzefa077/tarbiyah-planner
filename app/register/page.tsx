"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
    // Store the values entered by the parent.
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Used to disable the button while the request is running.
    const [isLoading, setIsLoading] = useState(false);

    // Stores an error message returned by the API.
    const [error, setError] = useState("");

    // Stores the successful registration message.
    const [success, setSuccess] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        // Clear messages from the previous request.
        setError("");
        setSuccess("");

        setIsLoading(true);

        try {
            /*
            Send the form data to our backend.

            POST /api/auth/register
            */
            const response = await fetch(
                "/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        fullName,
                        email,
                        password,
                    }),
                }
            );

            // Convert the backend response into JavaScript.
            const data = await response.json();

            /*
            The backend returns success: true/false.

            If the HTTP request itself failed, show the
            message returned by the API.
            */
            if (!response.ok) {
                setError(
                    data.message ||
                        "Registration failed."
                );

                return;
            }

            /*
            Registration succeeded.

            We don't need to store a token here because
            registration currently only creates the account.

            Login will create the authentication cookie.
            */
            setSuccess(
                "Account created successfully. You can now log in."
            );

            // Clear the form after successful registration.
            setFullName("");
            setEmail("");
            setPassword("");

        } catch (error) {

            /*
            This catches errors such as a network failure
            where the request could not reach the server.
            */
            console.error(
                "Registration request failed:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {
            // Re-enable the button.
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                <h1 className="text-3xl font-bold text-center">
                    Create Account
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Start building your child&apos;s Tarbiyah Planner
                </p>

                <form
                    className="mt-8 space-y-5"
                    onSubmit={handleSubmit}
                >

                    {/* Parent name */}
                    <div>
                        <label className="font-medium">
                            Parent Name
                        </label>

                        <Input
                            type="text"
                            placeholder="Enter your name"
                            value={fullName}
                            onChange={(event) =>
                                setFullName(
                                    event.target.value
                                )
                            }
                        />
                    </div>

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

                    {/* Success message */}
                    {success && (
                        <p className="text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Creating Account..."
                            : "Register"}
                    </Button>

                </form>

                <p className="text-center text-sm mt-6">
                    Already have an account?{" "}

                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </main>
    );
}