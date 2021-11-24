
exports.up = async (knex) => {
    return knex.schema.table('users', (table) => {
      table.string('first_name');
      table.string('last_name');
    })
};

exports.down = async (knex) => {
    return knex.schema.table('users', (table) => {
        table.dropColumn('first_name');
        table.dropColumn('last_name');
    })
};
