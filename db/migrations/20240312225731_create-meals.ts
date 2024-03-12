import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    knex.schema.createTable('meals', (table) => {
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.text('meal_date').notNullable()
        table.boolean('inside_diet').notNullable()
        table.text('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    knex.schema.dropTable('meals')
}
