import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import type { ISuggestion, IUser, IObservation } from "../types/types.js";

@Entity()
export class Suggestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text"})
    suggested_name: string; 

    @CreateDateColumn()
    date: Date;

    @ManyToOne("User", (user: IUser) => user.suggestions, {onDelete: "CASCADE"})
    user: IUser;

    @ManyToOne("Observation", (observation: IObservation) => observation.suggestions, {onDelete: "CASCADE"})
    observation: IObservation;
}