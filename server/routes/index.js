// @ts-check

import welcome from './welcome.js';
import labels from './labels.js';
import session from './session.js';
import statuses from './statuses.js';
import tasks from './tasks.js';
import users from './users.js';

const controllers = [
  welcome,
  session,
  labels,
  statuses,
  tasks,
  users,
];

export default (app) => controllers.forEach((f) => f(app));
