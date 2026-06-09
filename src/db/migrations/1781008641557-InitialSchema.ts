import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1781008641557 implements MigrationInterface {
  name = 'InitialSchema1781008641557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "alert_type" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_34f04b83e501fb1bea31e237418" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "alert_history_status_enum" AS ENUM('pending', 'sent', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "alert_history" ("id" SERIAL NOT NULL, "triggeredAt" TIMESTAMP DEFAULT now(), "eventData" jsonb NOT NULL, "status" "alert_history_status_enum" NOT NULL DEFAULT 'pending', "deliveredAt" TIMESTAMP DEFAULT now(), "alert_rule_id" integer, CONSTRAINT "PK_01cc54a2bdfa890a86511d26822" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "alert_rules_alertrulestatus_enum" AS ENUM('greater_than', 'less_than', 'equals')`,
    );
    await queryRunner.query(
      `CREATE TYPE "alert_rules_notificationtype_enum" AS ENUM('email', 'webhook')`,
    );
    await queryRunner.query(
      `CREATE TABLE "alert_rules" ("id" SERIAL NOT NULL, "targetAddress" character varying NOT NULL, "alertRuleStatus" "alert_rules_alertrulestatus_enum", "thresholdValue" bigint, "notificationType" "alert_rules_notificationtype_enum" NOT NULL DEFAULT 'email', "webhookUrl" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "alert_type_id" integer, "user_id" uuid, CONSTRAINT "PK_ae580564f087ffab9d229225aec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdate" TIMESTAMP DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" date, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_history" ADD CONSTRAINT "FK_a04afdb7240fdd7666e3a903574" FOREIGN KEY ("alert_rule_id") REFERENCES "alert_rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_rules" ADD CONSTRAINT "FK_da96a887e9bb2f0b72dd6ea76e6" FOREIGN KEY ("alert_type_id") REFERENCES "alert_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_rules" ADD CONSTRAINT "FK_28f424f9442043318dd4f8a4f58" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "alert_rules" DROP CONSTRAINT "FK_28f424f9442043318dd4f8a4f58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_rules" DROP CONSTRAINT "FK_da96a887e9bb2f0b72dd6ea76e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_history" DROP CONSTRAINT "FK_a04afdb7240fdd7666e3a903574"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "alert_rules"`);
    await queryRunner.query(`DROP TYPE "alert_rules_notificationtype_enum"`);
    await queryRunner.query(`DROP TYPE "alert_rules_alertrulestatus_enum"`);
    await queryRunner.query(`DROP TABLE "alert_history"`);
    await queryRunner.query(`DROP TYPE "alert_history_status_enum"`);
    await queryRunner.query(`DROP TABLE "alert_type"`);
  }
}
