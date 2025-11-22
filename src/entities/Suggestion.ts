import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import type { User } from "./User.js";
import { Observation } from "./Observation.js";

@Entity()
export class Suggestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text"})
    suggested_name: string; 

    @CreateDateColumn()
    date: Date;

    @ManyToOne("User", (user: User) => user.suggestions, {onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Observation, (observation) => observation.suggestions, {onDelete: "CASCADE"})
    observation: Observation;
}