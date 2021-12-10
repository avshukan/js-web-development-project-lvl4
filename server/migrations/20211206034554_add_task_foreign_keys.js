exports.up = (knex) => knex.schema.table('tasks', (table) => {
  table.foreign('status_id', 'task_status_id_fk').references('statuses.id');
  table.foreign('creator_id', 'task_creator_id_fk').references('users.id');
});

exports.down = (knex) => knex.schema.table('tasks', (table) => {
  table.dropForeign('status_id', 'task_status_id_fk');
  table.dropForeign('creator_id', 'task_creator_id_fk');
});
