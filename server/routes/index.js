// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import session from './session.js';
import statuses from './statuses.js';
import db from './db';

const controllers = [
  welcome,
  users,
  session,
  statuses,
  db,
];

export default (app) => controllers.forEach((f) => f(app));
