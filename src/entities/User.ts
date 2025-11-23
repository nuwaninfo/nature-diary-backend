import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import type { IUser, IObservation, ISuggestion } from "../types/types.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  role: string;

  @CreateDateColumn()
  addedDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany("Observation", (observation: IObservation) => observation.user)
  observations: IObservation[];

  @OneToMany("Suggestion", (suggestion: ISuggestion) => suggestion.user)
   suggestions: ISuggestion[];
}
