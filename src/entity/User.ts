import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  BeforeInsert,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { userRoles } from "../enum/userroles.enum";
import { Admin } from "./Admin";
import { Retailer } from "./Retailer";
import {Encrypt} from "../helpers/encrypt.helper";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: userRoles, default: userRoles.USER })
  role: userRoles;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  otp: number;

  @Column({ nullable: true })
  otpValidTill: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // ✅ Bidirectional link to Admin
  @OneToOne(() => Admin, (admin) => admin.user, { cascade: ["insert"] })
  admin: Admin;

  @OneToMany(() => Retailer, (retailer) => retailer.user, { cascade: ["insert"] })
  retailer: Retailer;
  // @BeforeInsert()
  // async hashPassword() {
  //   this.password = await Encrypt.hashPassword(this.password);
  // }
}

