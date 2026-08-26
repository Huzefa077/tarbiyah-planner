import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { ILike } from "typeorm";
import { z } from "zod";

import { User } from "@/database/entities/User";
import { connectDatabase } from "@/lib/database";
import { sendEmailVerificationEmail } from "@/lib/email";

/*
  RESEND EMAIL VERIFICATION API

  This route gives a pending password account a fresh, one-time
  verification link. The response stays generic so strangers cannot
  use it to discover which email addresses have accounts.
*/

const resendSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

const genericMessage =
  "If this email belongs to a pending account, a new verification link will arrive shortly.";

export async function POST(request: Request) {
  try {
    const result = resendSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const database = await connectDatabase();
    const userRepository = database.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: ILike(result.data.email) },
    });

    // Google and verified accounts do not need a verification email.
    if (!user || user.emailVerifiedAt || !user.password) {
      return NextResponse.json({ message: genericMessage });
    }

    // Limit a pending account to one new message per minute.
    if (
      user.emailVerificationRequestedAt &&
      Date.now() - user.emailVerificationRequestedAt.getTime() < 60_000
    ) {
      return NextResponse.json(
        { message: "Please wait one minute before requesting another verification email." },
        { status: 429 }
      );
    }

    const rawVerificationToken = randomBytes(32).toString("hex");
    user.emailVerificationTokenHash = createHash("sha256")
      .update(rawVerificationToken)
      .digest("hex");
    user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.emailVerificationRequestedAt = new Date();
    await userRepository.save(user);

    const verificationUrl = new URL("/verify-email", request.url);
    verificationUrl.searchParams.set("token", rawVerificationToken);

    try {
      await sendEmailVerificationEmail({
        recipient: user.email,
        verificationUrl: verificationUrl.toString(),
      });
    } catch (emailError) {
      console.error("Resend-verification email failed:", emailError);
      return NextResponse.json(
        { message: "We could not send a verification email right now. Please try again shortly." },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: genericMessage });
  } catch (error) {
    console.error("Resend-verification request failed:", error);
    return NextResponse.json(
      { message: "Unable to resend the verification email. Please try again." },
      { status: 500 }
    );
  }
}
