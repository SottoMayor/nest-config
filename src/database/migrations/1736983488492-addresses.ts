import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Addresses1736983488492 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'address',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'uuid',
              },
              {
                name: 'neighborhood',
                type: 'varchar',
                length: '255',
              },
              {
                name: 'zip_code',
                type: 'varchar',
                length: '10',
              },
              {
                name: 'number',
                type: 'varchar',
                length: '10',
              },
              {
                name: 'city',
                type: 'varchar',
                length: '100',
              },
              {
                name: 'state',
                type: 'varchar',
                length: '100',
              },
              {
                name: 'created_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
              },
              {
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
              },
            ],
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('address');
      }

}
