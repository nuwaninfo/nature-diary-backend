import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Observation } from "../entities/Observation.js";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("float")
  latitude: number;

  @Column("float")
  longitude: number;

  @CreateDateColumn()
  addedDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  // Relationship: one location belongs to one observation
  @OneToOne(() => Observation, (observation) => observation.location, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  observation: Observation;
}
