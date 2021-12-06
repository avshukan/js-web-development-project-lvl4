
exports.up = async (knex) => {
    return knex.schema.table('tasks', (table) => {
        table.foreign('statusId', 'task_statusId_fk').references('statuses.id');
        table.foreign('creatorId', 'task_creatorId_fk').references('users.id');
        table.foreign('executorId', 'task_executorId_fk').references('users.id');
    })
};

exports.down = async (knex) => {
    return knex.schema.table('tasks', (table) => {
        table.dropForeign('statusId');
        table.dropForeign('creatorId');
        table.dropForeign('executorId');
    })
};
