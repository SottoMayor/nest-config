import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterUser1731283301964 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "email",
            type: "varchar",
            isUnique: true,
            isNullable: true,
        }));

        await queryRunner.addColumn("user", new TableColumn({
            name: "password",
            type: "varchar",
            isNullable: true
        }));

        await queryRunner.addColumn("user", new TableColumn({
            name: "is_admin",
            type: "boolean",
            default: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "email");
        await queryRunner.dropColumn("user", "password");
        await queryRunner.dropColumn("user", "is_admin");
    }

}
