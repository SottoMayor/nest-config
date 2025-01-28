import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Documents1736983514106 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'document',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'rg',
                type: 'varchar',
                length: '20',
              },
              {
                name: 'cpf',
                type: 'varchar',
                length: '11',
              },
              {
                name: 'passport',
                type: 'varchar',
                length: '20',
                isNullable: true,
              },
              {
                name: 'user_id',
                type: 'int',
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
            foreignKeys: [
              {
                columnNames: ['user_id'],
                referencedTableName: 'user',
                referencedColumnNames: ['id'], 
                onDelete: 'SET NULL',
              },
            ],
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('document');
      }

}
