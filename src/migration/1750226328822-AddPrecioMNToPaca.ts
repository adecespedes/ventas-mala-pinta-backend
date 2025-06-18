import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPrecioMNToPaca1681234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agrega la columna como nullable
    await queryRunner.query(`
      ALTER TABLE "paca" ADD COLUMN "precioMN" integer
    `);

    // 2. Actualiza los valores con la multiplicación precio * cambio
    await queryRunner.query(`
      UPDATE "paca" SET "precioMN" = "precio" * "cambio"
    `);

    // 3. Establece la columna como NOT NULL
    await queryRunner.query(`
      ALTER TABLE "paca" ALTER COLUMN "precioMN" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Elimina la columna si haces rollback
    await queryRunner.query(`
      ALTER TABLE "paca" DROP COLUMN "precioMN"
    `);
  }
}
