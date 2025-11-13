import type { MigrationInterface, QueryRunner } from "typeorm";

export class ObservationTable1763018490095 implements MigrationInterface {
  name = "ObservationTable1763018490095";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "observation" ("id" SERIAL NOT NULL, "isDomestic" boolean NOT NULL DEFAULT false, "needToShare" boolean NOT NULL DEFAULT false, "needIdentification" boolean NOT NULL DEFAULT false, "category" character varying NOT NULL, "dateOfObservation" date NOT NULL, "description" text, "addedDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_77a736edc631a400b788ce302cb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "image" ("id" SERIAL NOT NULL, "imageName" character varying NOT NULL, "addedDate" TIMESTAMP NOT NULL DEFAULT now(), "observationId" integer, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "location" ("id" SERIAL NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "addedDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "observationId" integer, CONSTRAINT "REL_ab96c6049bfeafb293fa6fa13d" UNIQUE ("observationId"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" ADD CONSTRAINT "FK_95e7f729cee52110c1f9a9e719d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_c4fc71e426151dea3b8a4a1c06c" FOREIGN KEY ("observationId") REFERENCES "observation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_ab96c6049bfeafb293fa6fa13d5" FOREIGN KEY ("observationId") REFERENCES "observation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_ab96c6049bfeafb293fa6fa13d5"`
    );
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_c4fc71e426151dea3b8a4a1c06c"`
    );
    await queryRunner.query(
      `ALTER TABLE "observation" DROP CONSTRAINT "FK_95e7f729cee52110c1f9a9e719d"`
    );
    await queryRunner.query(`DROP TABLE "location"`);
    await queryRunner.query(`DROP TABLE "image"`);
    await queryRunner.query(`DROP TABLE "observation"`);
  }
}
