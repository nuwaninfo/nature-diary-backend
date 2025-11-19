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

  @Column("float", { nullable: true })
  lat: number | null;

  @Column("float", { nullable: true })
  lng: number | null;

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
