import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    knex.schema.createTable('users', (table) => {
        table.uuid('id').primary()
        table.text('email').notNullable()
        table.text('first_name').notNullable()
        table.text('last_name').notNullable()
        table.text('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    knex.schema.dropTable('users')
}
