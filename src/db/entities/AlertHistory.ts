  import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AlertRule } from "./AlertRule";
import { AlertHistoryStatus } from "../../core/enums/alertHistoryStatus";

@Entity("alert_history")
export class AlertHistory extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => AlertRule, (rule) => rule.alertHistories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "alert_rule_id" })
  alertRule: AlertRule;

  @CreateDateColumn({ nullable: true })
  triggeredAt: Date;

  @Column({
    type: "jsonb",
  })
  eventData: Record<string, any>;

  @Column({
    type: "enum",

    enum: AlertHistoryStatus,
    default: AlertHistoryStatus.PENDING,
  })
  status: AlertHistoryStatus;

  @CreateDateColumn({ nullable: true })
  deliveredAt: Date;
}
