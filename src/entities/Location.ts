import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import type { ILocation, IObservation } from "../types/types.js";

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

  @OneToOne(
    "Observation",
    (observation: IObservation) => observation.location,
    {
      onDelete: "CASCADE",
    }
  )
  @JoinColumn()
  observation: IObservation;
}
