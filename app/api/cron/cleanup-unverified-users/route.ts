import { NextResponse } from "next/server";

import { User } from "@/database/entities/User";
import { connectDatabase } from "@/lib/database";

/*
  DAILY UNVERIFIED-ACCOUNT CLEANUP

  Vercel calls this route once a day. It removes only pending
  password accounts whose email-verification link has expired.

  It never removes:
  - verified password accounts
  - Google accounts (Google marks their email as verified)
  - old accounts without a verification expiry date
*/
export async function GET(request: Request) {
  // A cron URL must not be publicly usable to delete accounts.
  const authorization = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const database = await connectDatabase();

    const result = await database
      .getRepository(User)
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('"emailVerifiedAt" IS NULL')
      .andWhere('"emailVerificationExpiresAt" IS NOT NULL')
      .andWhere('"emailVerificationExpiresAt" < :now', { now: new Date() })
      .execute();

    return NextResponse.json({
      message: "Expired unverified accounts cleaned up.",
      deletedCount: result.affected ?? 0,
    });
  } catch (error) {
    console.error("Unverified-account cleanup failed:", error);

    return NextResponse.json(
      { message: "Unable to clean up unverified accounts." },
      { status: 500 }
    );
  }
}
