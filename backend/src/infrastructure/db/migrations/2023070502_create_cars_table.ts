import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cars', (table) => {
    table.uuid('id').primary();
    table.string('brand').notNullable();
    table.string('model').notNullable();
    table.integer('stock').notNullable();
    table.decimal('peak_season_price', 10, 2).notNullable();
    table.decimal('mid_season_price', 10, 2).notNullable();
    table.decimal('off_season_price', 10, 2).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('cars');
}
