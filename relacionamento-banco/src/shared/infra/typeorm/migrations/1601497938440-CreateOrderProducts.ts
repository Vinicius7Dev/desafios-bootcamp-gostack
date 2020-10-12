import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateOrderProducts1601497938440 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'orders_products',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'product_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'order_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 10,
                    scale: 2
                },
                {
                    name: 'quantity',
                    type: 'int',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
            foreignKeys: [
                {
                    name: 'OrderID',
                    columnNames: ['order_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'orders',
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE'
                },
                {
                    name: 'ProductID',
                    columnNames: ['product_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'products',
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE',
                }
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('orders_products');
    }
}
