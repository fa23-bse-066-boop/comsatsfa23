import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostgresNotesTable1751106000000
  implements MigrationInterface
{
  name = 'CreatePostgresNotesTable1751106000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "postgres_notes" (
        "id" SERIAL NOT NULL,
        "title" character varying(120) NOT NULL,
        "content" text NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_postgres_notes_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "postgres_notes"`);
  }
}
