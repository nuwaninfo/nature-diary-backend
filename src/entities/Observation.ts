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
import type { IObservation, IUser, IImage, ILocation, ISuggestion } from "../types/types.js";

export type CategoryType = "fauna" | "flora" | "funga";

@Entity()
export class Observation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  scientific_name: string;

  @Column({ type: "text", nullable: true })
  common_name: string;

  @Column({ type: "text", nullable: true })
  discovery: string;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  identified: boolean;

  @Column()
  category: CategoryType;

  @Column({ type: "date", nullable: true })
  date: Date;

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

  @OneToMany("Suggestion", (suggestion: ISuggestion) => suggestion.observation) suggestions: ISuggestion[];
}
