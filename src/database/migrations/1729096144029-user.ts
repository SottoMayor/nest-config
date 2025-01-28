import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1697654321000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'birthdate',
                        type: 'date',
                    },
                    {
                        name: 'gender',
                        type: 'enum',
                        enum: ['M', 'F'],
                    },
                    {
                        name: 'height',
                        type: 'float',
                    },
                    {
                        name: 'weight',
                        type: 'float',
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
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }
}
