import type { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableLocation1763411505299 implements MigrationInterface {
  name = "AlterTableLocation1763411505299";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "latitude"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" ADD "latitude" double precision NOT NULL`
    );
  }
}
