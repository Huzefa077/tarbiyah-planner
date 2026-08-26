import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";

import { z } from "zod";
import { connectDatabase } from "@/lib/database";
import { User } from "@/database/entities/User";
import { sendEmailVerificationEmail } from "@/lib/email";

/*
==========================================================
REGISTER API

POST /api/auth/register

Responsible for:

1. Receiving registration data
2. Validating the data
3. Checking whether the email already exists
4. Hashing the password
5. Creating the user in PostgreSQL
6. Returning a safe response

The password is NEVER returned to the client.
==========================================================
*/


// --------------------------------------------------------
// 1. Define what valid registration data looks like
// --------------------------------------------------------

const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must contain at least 2 characters"),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters"),
});


// --------------------------------------------------------
// 2. Handle POST /api/auth/register
// --------------------------------------------------------

export async function POST(request: Request) {
    try {
        // Read the JSON body sent by the register page.
        const body = await request.json();

        // Validate the incoming data.
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.error.issues[0].message,
                },
                {
                    status: 400,
                }
            );
        }

        /*
        result.data is now guaranteed to contain valid data.

        We use the validated values instead of trusting the
        original request body.
        */
        const {
            fullName,
            email,
            password,
        } = result.data;


        // ------------------------------------------------
        // 3. Connect to PostgreSQL
        // ------------------------------------------------

        const database = await connectDatabase();


        // ------------------------------------------------
        // 4. Get the User repository
        // ------------------------------------------------

        const userRepository =
            database.getRepository(User);


        // ------------------------------------------------
        // 5. Check whether the email already exists
        // ------------------------------------------------

        const existingUser =
            await userRepository.findOne({
                where: { email },
            });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "An account with this email already exists.",
                },
                {
                    status: 409,
                }
            );
        }


        // ------------------------------------------------
        // 6. Hash the password
        // ------------------------------------------------

        /*
        NEVER store the user's original password.

        bcrypt automatically creates a salt as part of the
        hashing process.

        "10" is the bcrypt cost factor.
        */
        const passwordHash =
            await bcrypt.hash(password, 10);


        // ------------------------------------------------
        // 7. Create the User entity
        // ------------------------------------------------

        const rawVerificationToken = randomBytes(32).toString("hex");

        const user =
            userRepository.create({
                fullName,
                email,
                password: passwordHash,
                emailVerifiedAt: null,
                emailVerificationTokenHash: createHash("sha256")
                    .update(rawVerificationToken)
                    .digest("hex"),
                emailVerificationExpiresAt: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                ),
                emailVerificationRequestedAt: new Date(),
            });


        // ------------------------------------------------
        // 8. Save the user to PostgreSQL
        // ------------------------------------------------

        const savedUser =
            await userRepository.save(user);

        const verificationUrl = new URL("/verify-email", request.url);
        verificationUrl.searchParams.set("token", rawVerificationToken);

        try {
            await sendEmailVerificationEmail({
                recipient: savedUser.email,
                verificationUrl: verificationUrl.toString(),
            });
        } catch (emailError) {
            // An account that cannot receive a verification email should not remain registered.
            await userRepository.remove(savedUser);
            console.error("Email-verification message failed:", emailError);

            return NextResponse.json(
                {
                    success: false,
                    message: "We could not send a verification email. Please try again.",
                },
                { status: 503 }
            );
        }


        // ------------------------------------------------
        // 9. Return a safe response
        // ------------------------------------------------

        /*
        Notice that we deliberately DO NOT return:

        savedUser.password

        The password hash should never be sent to the browser.
        */

        return NextResponse.json(
            {
                success: true,
                message: "Account created. Check your inbox to verify your email before signing in.",
                user: {
                    id: savedUser.id,
                    fullName: savedUser.fullName,
                    email: savedUser.email,
                },
            },
            {
                status: 201,
            }
        );

    } catch (error) {

        /*
        Unexpected server/database error.

        We log the actual error on the server but don't expose
        internal database details to the user.
        */

        console.error(
            "Registration error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while creating your account.",
            },
            {
                status: 500,
            }
        );
    }
}
