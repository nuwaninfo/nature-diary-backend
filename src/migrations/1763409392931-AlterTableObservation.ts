import type { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableObservation1763409392931 implements MigrationInterface {
  name = "AlterTableObservation1763409392931";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "observation" DROP COLUMN "isDomestic"`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" DROP COLUMN "needToShare"`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" DROP COLUMN "needIdentification"`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" DROP COLUMN "dateOfObservation"`
    );
    await queryRunner.query(`ALTER TABLE "observation" ADD "discovery" text`);
    await queryRunner.query(
      `ALTER TABLE "observation" ADD "public" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" ADD "identified" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(`ALTER TABLE "observation" ADD "date" date`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "observation" DROP COLUMN "identified"`
    );
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "public"`);
    await queryRunner.query(
      `ALTER TABLE "observation" DROP COLUMN "discovery"`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" ADD "dateOfObservation" date NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" ADD "needIdentification" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" ADD "needToShare" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" ADD "isDomestic" boolean NOT NULL DEFAULT false`
    );
  }
}
