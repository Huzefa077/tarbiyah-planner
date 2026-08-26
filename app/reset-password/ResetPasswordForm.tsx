"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { usePageLoader } from "@/components/common/PageLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// This interactive form receives the token from the server page, not from browser storage.
export default function ResetPasswordForm({ token }: { token: string }) {
    const { startLoading, stopLoading } = usePageLoader();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        startLoading();

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to reset password.");
                return;
            }

            setMessage(data.message);
            setPassword("");
            setConfirmPassword("");
        } catch {
            setError("Unable to reach the server. Please try again.");
        } finally {
            setIsSubmitting(false);
            stopLoading();
        }
    }

    if (!token) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
                <section className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                    <h1 className="text-3xl font-bold">Invalid reset link</h1>
                    <p className="mt-3 text-gray-600">Request a new password-reset link and try again.</p>
                    <Button className="mt-6" render={<Link href="/forgot-password" />} nativeButton={false}>
                        Request a new link
                    </Button>
                </section>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="text-center text-3xl font-bold">Choose a new password</h1>
                <p className="mt-2 text-center text-gray-500">Use at least 8 characters.</p>

                {message ? (
                    <div className="mt-8 text-center">
                        <p className="text-green-600">{message}</p>
                        <Button className="mt-6" render={<Link href="/login" />} nativeButton={false}>
                            Sign in
                        </Button>
                    </div>
                ) : (
                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <PasswordField
                            id="new-password"
                            label="New password"
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />

                        <PasswordField
                            id="confirm-password"
                            label="Confirm new password"
                            password={confirmPassword}
                            setPassword={setConfirmPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <Button className="w-full" disabled={isSubmitting} type="submit">
                            {isSubmitting ? "Resetting password..." : "Reset password"}
                        </Button>
                    </form>
                )}
            </section>
        </main>
    );
}

function PasswordField({
    id,
    label,
    password,
    setPassword,
    showPassword,
    setShowPassword,
}: {
    id: string;
    label: string;
    password: string;
    setPassword: (value: string) => void;
    showPassword: boolean;
    setShowPassword: (value: boolean) => void;
}) {
    return (
        <div>
            <label className="font-medium" htmlFor={id}>{label}</label>
            <div className="relative mt-2">
                <Input
                    id={id}
                    required
                    minLength={8}
                    type={showPassword ? "text" : "password"}
                    className="pr-12"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                >
                    {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
            </div>
        </div>
    );
}
