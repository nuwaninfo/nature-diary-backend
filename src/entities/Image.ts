import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Observation } from "../entities/Observation.js";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageName: string;

  @CreateDateColumn()
  addedDate: Date;

  @ManyToOne(() => Observation, (observation) => observation.images, {
    onDelete: "CASCADE",
  })
  observation: Observation;
}
