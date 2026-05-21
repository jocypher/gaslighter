import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AlertType } from "./AlertType";
import { User } from "./User";
import { AlertRuleStatus } from "../../core/enums/alertRuleStatus";
import { NotificationType } from "../../core/enums/notificationType";
import { AlertHistory } from "./AlertHistory";

@Entity("alert_rules")
export class AlertRule extends BaseEntity{
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => AlertType, (type) => type.alertRules)
  @JoinColumn({ name: "alert_type_id" })
  alertType: AlertType;

  @ManyToOne(() => User, (user) => user.alertRules, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: false })
  targetAddress: string;

  @Column({
    type: "enum",
    enum: AlertRuleStatus,
    default: AlertRuleStatus.EQUALS,
  })
  alertRuleStatus: AlertRuleStatus;

  @OneToMany(() => AlertHistory, (history) => history.alertRule)
  alertHistories: AlertHistory[];
  

  @Column({
    type: "bigint",
    nullable:true
  })
  thresholdValue: bigint;

  @Column({
    type: "enum",
    enum: NotificationType,
    default: NotificationType.EMAIL,
  })
  notificationType: NotificationType;

  @Column({ nullable: true })
  webhookUrl: string;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;
}