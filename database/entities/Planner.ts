import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

import type { User } from "./User";
import type { Section } from "./Section";

/*
==========================================================
PLANNER ENTITY

A Planner belongs to exactly one User.

A Planner can contain many Sections.

The User owns the relationship through the
foreign key stored in the Planner table.
==========================================================
*/

@Entity("Planner")
export class Planner {

    // Unique planner ID.
    @PrimaryGeneratedColumn()
    id!: number;

    // Planner title.
    @Column()
    title!: string;

    /*
    Many planners can belong to one user.

    This creates the foreign key from Planner -> User.
    */
    @ManyToOne(
        "User",
        {
            onDelete: "CASCADE",
        }
    )
    user!: User;

    /*
    One Planner can contain many Sections.

    We keep this relationship here so the Section table
    can store the planner foreign key.
    */
    @OneToMany(
        "Section",
        (section: Section) => section.planner
    )
    sections!: Section[];

    // Automatically created timestamp.
    @CreateDateColumn()
    createdAt!: Date;

    // Automatically updated timestamp.
    @UpdateDateColumn()
    updatedAt!: Date;
}