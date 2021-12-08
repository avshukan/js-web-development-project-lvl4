exports.up = (knex) => knex.schema.table('tasks', (table) => {
  table.foreign('statusId', 'task_statusId_fk').references('statuses.id');
  table.foreign('creatorId', 'task_creatorId_fk').references('users.id');
  table.foreign('executorId', 'task_executorId_fk').references('users.id');
});

exports.down = (knex) => knex.schema.table('tasks', (table) => {
  table.dropForeign('statusId', 'task_statusId_fk');
  table.dropForeign('creatorId', 'creatorId');
  table.dropForeign('executorId', 'executorId');
});
