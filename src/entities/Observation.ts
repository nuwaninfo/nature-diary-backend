import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { IObservation, IUser, IImage, ILocation } from "../types/types.js";

export type CategoryType = "fauna" | "flora" | "funga";

@Entity()
export class Observation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isDomestic: boolean;

  @Column({ default: false })
  needToShare: boolean;

  @Column({ default: false })
  needIdentification: boolean;

  @Column()
  category: CategoryType;

  @Column({ type: "date" })
  dateOfObservation: Date;

  @Column({ type: "text", nullable: true })
  description: string;

  @CreateDateColumn()
  addedDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne("User", (user: IUser) => user.observations, {
    onDelete: "CASCADE",
  })
  user: IUser;

  @OneToMany("Image", (image: IImage) => image.observation, { cascade: true })
  images: IImage[];

  @OneToOne("Location", (location: ILocation) => location.observation, {
    cascade: true,
    nullable: true,
  })
  location?: ILocation;
}
