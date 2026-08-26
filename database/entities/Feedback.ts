import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

/*
FEEDBACK ENTITY

One row represents one message submitted from the Feedback page.
It is intentionally separate from planners: feedback is about the product,
not part of a child's planner data.
*/
@Entity("feedback_messages")
export class Feedback {
    @PrimaryGeneratedColumn()
    id!: number;

    // The kind of message helps you filter ideas from bug reports later.
    @Column({ type: "varchar" })
    category!: "idea" | "feedback" | "problem";

    @Column({ type: "text" })
    message!: string;

    // Optional, so guests can send feedback without creating an account.
    // Explicit type is required because `string | null` otherwise becomes Object at runtime.
    @Column({ type: "varchar", nullable: true })
    contactEmail!: string | null;

    // Optional because guest visitors do not have a User ID.
    // Explicit type is required because `number | null` otherwise becomes Object at runtime.
    @Column({ type: "integer", nullable: true })
    userId!: number | null;

    @CreateDateColumn()
    createdAt!: Date;
}
