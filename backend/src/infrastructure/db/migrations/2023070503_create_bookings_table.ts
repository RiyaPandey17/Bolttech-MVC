import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('bookings', (table) => {
    table.uuid('id').primary();
    table.uuid('car_id').notNullable()
      .references('id').inTable('cars')
      .onDelete('CASCADE');
    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
    table.date('date_from').notNullable();
    table.date('date_to').notNullable();
    table.decimal('total_price', 10, 2).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('bookings');
}
