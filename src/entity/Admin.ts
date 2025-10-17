import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {User} from "./User";

@Entity({ name: "admin" })
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  // ✅ Use lazy function to avoid circular init error
  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  designation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
