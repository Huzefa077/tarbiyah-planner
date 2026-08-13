import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

import type { Section } from "./Section";

/*
==========================================================
ACTIVITY ENTITY

An Activity belongs to one Section.

Examples:

Section: Learn & Read
    ├── Quran Reading
    ├── Islamic Story
    └── Blank Activity

Section: Prayer
    ├── Fajr
    └── Dhuhr

The Section ID is stored through the relation below.
==========================================================
*/

@Entity()
export class Activity {

    // Unique activity ID.
    @PrimaryGeneratedColumn()
    id!: number;

    // Activity name.
    // Blank activities can store an empty string.
    @Column()
    name!: string;

    // True when this activity should appear as a
    // handwriting blank in the planner.
    @Column({ default: false })
    isBlank!: boolean;

    /*
    Many Activities can belong to one Section.

    This is the owning side of the relationship and
    creates the foreign key from Activity -> Section.
    */
    @ManyToOne(
        "Section",
        {
            onDelete: "CASCADE",
        }
    )
    section!: Section;

    // Automatically created when the activity is inserted.
    @CreateDateColumn()
    createdAt!: Date;

    // Automatically updated when the activity changes.
    @UpdateDateColumn()
    updatedAt!: Date;
}