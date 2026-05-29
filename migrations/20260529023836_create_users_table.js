/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable(
        'users',
        table => {
            table.increments('id').primary()

            table.string('name').notNullable()
            table.string('role').notNullable()

            table
                .string('email')
                .unique()
                .notNullable()

            // nullable password
            table.string('password').nullable()

            table.text('photo')

            // login provider
            table
                .string('provider')
                .defaultTo('email')

            table
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
        }
    )
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users')
}