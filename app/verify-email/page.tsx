import VerifyEmailForm from "./VerifyEmailForm";

// ROUTE: /verify-email — receives the token from the email link and passes it to the client form.
export default async function VerifyEmailPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const { token } = await searchParams;

    return <VerifyEmailForm token={token || ""} />;
}
