import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import bcrypt from "bcryptjs"
import { AlertRule } from "./AlertRule";


@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 100, nullable: false })
  userName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => AlertRule, (rule) => rule.user)
  alertRules: AlertRule[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn({ nullable: true })
  lastUpdate: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith("$2a$")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}