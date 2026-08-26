import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

/*
==========================================================
USER ENTITY

Represents a registered user.

A User can own Planners, but we do not need a
OneToMany property here yet.

The Planner table will contain the actual foreign key
to the User.
==========================================================
*/

@Entity("User")
export class User {

    // Unique ID for the user.
    @PrimaryGeneratedColumn()
    id!: number;

    // User's full name.
    @Column()
    fullName!: string;

    // Email must be unique.
    @Column({ unique: true })
    email!: string;

    /*
    Password is stored as a bcrypt hash.

    Never store the user's original password.
    */
    // Password is null for an account created only through Google sign-in.
    @Column({ type: "varchar", nullable: true })
    password!: string | null;

    // Google's stable user ID. It is not the same as an email address.
    @Column({ type: "varchar", unique: true, nullable: true })
    googleId!: string | null;

    // Google verifies Google sign-in emails. Password accounts verify through our email link.
    @Column({ type: "timestamptz", nullable: true })
    emailVerifiedAt!: Date | null;

    // Like reset tokens, verification tokens are stored only as hashes.
    @Column({ type: "varchar", nullable: true })
    emailVerificationTokenHash!: string | null;

    @Column({ type: "timestamptz", nullable: true })
    emailVerificationExpiresAt!: Date | null;

    // Prevents a pending account from requesting verification emails too quickly.
    @Column({ type: "timestamptz", nullable: true })
    emailVerificationRequestedAt!: Date | null;

    // We store a hash of the reset token, never the usable token from the email link.
    @Column({ type: "varchar", nullable: true })
    passwordResetTokenHash!: string | null;

    // A reset link is valid for only a short time.
    @Column({ type: "timestamptz", nullable: true })
    passwordResetExpiresAt!: Date | null;

    // Prevents a known email address from receiving repeated reset emails too quickly.
    @Column({ type: "timestamptz", nullable: true })
    passwordResetRequestedAt!: Date | null;

    // Any login token created before this time becomes invalid after a password reset.
    @Column({ type: "timestamptz", nullable: true })
    passwordChangedAt!: Date | null;

    // Automatically created when the user is registered.
    @CreateDateColumn()
    createdAt!: Date;

    // Automatically updated when the record changes.
    @UpdateDateColumn()
    updatedAt!: Date;
}
