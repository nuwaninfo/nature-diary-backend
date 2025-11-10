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
import { User } from "./User.js";
import { Image } from "../entities/Image.js";
import { Location } from "../entities/Location.js";

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

  @ManyToOne(() => User, (user) => user.observations, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => Image, (image) => image.observation, { cascade: true })
  images: Image[];

  @OneToOne(() => Location, (location) => location.observation, {
    cascade: true,
    nullable: true,
  })
  location?: Location;
}
