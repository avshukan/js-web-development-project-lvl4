// @ts-check

import path from 'path';
import { Model } from 'objection';

export default class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer' },
        creatorId: { type: 'integer' },
        executorId: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      labels: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Label'),
        join: {
          from: 'labels.id',
          through: {
            from: 'tasks_labels.labelId',
            to: 'tasks_labels.taskId',
          },
          to: 'tasks.id',
        },
      },
    };
  }
}
