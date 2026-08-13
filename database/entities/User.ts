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

@Entity()
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
    @Column()
    password!: string;

    // Automatically created when the user is registered.
    @CreateDateColumn()
    createdAt!: Date;

    // Automatically updated when the record changes.
    @UpdateDateColumn()
    updatedAt!: Date;
}