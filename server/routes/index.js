// @ts-check

import welcome from './welcome.js';
import session from './session.js';
import statuses from './statuses.js';
import tasks from './tasks.js';
import users from './users.js';
import db from './db';

const controllers = [
  welcome,
  session,
  statuses,
  tasks,
  users,
  db,
];

export default (app) => controllers.forEach((f) => f(app));
