/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('testimonial_page_data', function (table) {
        table.increments('id').primary();
        table.string('component_name', 50).notNullable().unique();
        table.json('content_data').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('testimonial_page_data');
};
