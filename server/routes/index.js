// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import session from './session.js';
import db from './db';

const controllers = [
  welcome,
  users,
  session,
  db,
];

export default (app) => controllers.forEach((f) => f(app));
