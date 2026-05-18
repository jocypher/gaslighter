import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AlertRule } from "./AlertRule";

@Entity("alert_type")
export class AlertType{
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({nullable: false})
    type: string

    @OneToMany(()=>AlertRule, (rule)=>rule.alertType)
    alertRules: AlertRule[]
}