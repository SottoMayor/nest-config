import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterUser1736983503026 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adiciona a coluna address_id
        await queryRunner.addColumn(
          'user',
          new TableColumn({
            name: 'address_id',
            type: 'uuid',
            isNullable: true,
          }),
        );
    
        // Configura a chave estrangeira
        await queryRunner.createForeignKey(
          'user',
          new TableForeignKey({
            columnNames: ['address_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'address',
            onDelete: 'SET NULL',
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove a chave estrangeira
        const table = await queryRunner.getTable('user');
        const foreignKey = table.foreignKeys.find(
          (fk) => fk.columnNames.indexOf('address_id') !== -1,
        );
        if (foreignKey) {
          await queryRunner.dropForeignKey('user', foreignKey);
        }
    
        // Remove a coluna address_id
        await queryRunner.dropColumn('user', 'address_id');
      }

}
