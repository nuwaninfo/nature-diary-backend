import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailPaasword1760356008755 implements MigrationInterface {
  name = "AddEmailPaasword1760356008755";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
  }
}
