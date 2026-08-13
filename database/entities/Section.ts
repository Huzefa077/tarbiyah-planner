import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

import type { Planner } from "./Planner";
import type { Activity } from "./Activity";

/*
==========================================================
SECTION ENTITY

A Section belongs to one Planner.

Examples:

Prayer
Learn & Read
Good Deeds
Exercise
Family Time
or a custom/blank section.

The Planner -> Section relationship is represented
through the foreign key stored in this table.
==========================================================
*/

@Entity()
export class Section {

    // Unique section ID.
    @PrimaryGeneratedColumn()
    id!: number;

    // Section name.
    // Blank sections can store an empty string.
    @Column()
    name!: string;

    // True when the section should be displayed as blank.
    @Column({ default: false })
    isBlank!: boolean;

    // True when the section is one of the application's
    // built-in sections.
    @Column({ default: false })
    isDefault!: boolean;

    /*
    Many Sections can belong to one Planner.

    We use the string "Planner" so this file does not
    create a runtime import of Planner.

    That helps avoid the circular module evaluation
    problem we encountered with Next.js/Turbopack.
    */
    @ManyToOne(
        "Planner",
        {
            onDelete: "CASCADE",
        }
    )
    planner!: Planner;

    // One Section can contain many Activities.
    // This lets TypeORM load a complete saved planner in one query.
    @OneToMany(
        "Activity",
        (activity: Activity) => activity.section
    )
    activities!: Activity[];

    // Automatically created when the section is inserted.
    @CreateDateColumn()
    createdAt!: Date;

    // Automatically updated when the section changes.
    @UpdateDateColumn()
    updatedAt!: Date;
}
