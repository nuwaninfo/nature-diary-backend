import type { MigrationInterface, QueryRunner } from "typeorm";

export class AlterObservationTable1763502918219 implements MigrationInterface {
  name = "AlterObservationTable1763502918219";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "observation" ADD "scientific_name" text`
    );
    await queryRunner.query(`ALTER TABLE "observation" ADD "common_name" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "observation" DROP COLUMN "common_name"`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" DROP COLUMN "scientific_name"`
    );
  }
}
