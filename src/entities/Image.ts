import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import type { IImage, IObservation } from "../types/types.js";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageName: string;

  @CreateDateColumn()
  addedDate: Date;

  @ManyToOne("Observation", (observation: IObservation) => observation.images, {
    onDelete: "CASCADE",
  })
  observation: IObservation;
}
