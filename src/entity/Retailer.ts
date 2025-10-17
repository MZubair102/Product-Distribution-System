import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("retailers")
export class Retailer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shopname: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => User, (user) => user.retailer, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
