import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm";

export class ProfessionsUsers1736983533671 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'profession_user',
              columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                  name: 'user_id',
                  type: 'int',
                },
                {
                  name: 'profession_id',
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
            }),
          );
      
          await queryRunner.createForeignKey(
            'profession_user',
            new TableForeignKey({
              columnNames: ['user_id'],
              referencedTableName: 'user',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            }),
          );
      
          await queryRunner.createForeignKey(
            'profession_user',
            new TableForeignKey({
              columnNames: ['profession_id'],
              referencedTableName: 'profession',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            }),
          );

          await queryRunner.createUniqueConstraint(
            'profession_user',
            new TableUnique({
              name: 'UQ_profession_users_userid_professionid',
              columnNames: ['user_id', 'profession_id'],
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropUniqueConstraint(
          'profession_user',
          'UQ_profession_users_userId_professionId',
        );

        await queryRunner.dropTable('profession_user');
    }

}
