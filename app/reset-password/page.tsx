import ResetPasswordForm from "./ResetPasswordForm";

// ROUTE: /reset-password — reads the email token on the server, then renders the interactive form.
export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const { token } = await searchParams;

    return <ResetPasswordForm token={token || ""} />;
}
