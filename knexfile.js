// @ts-check

const path = require('path');

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

const {
  PG_HOST,
  PG_PORT,
  PG_BASE,
  PG_USER,
  PG_PASS,
} = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: PG_HOST,
      port: PG_PORT,
      database: PG_BASE,
      user: PG_USER,
      password: PG_PASS,
    },
    pool: {
      afterCreate: (conn, done) => {
        console.log('Pool created');
        done(false, conn);
      },
    },
    debug: true,
    acquireConnectionTimeout: 2000,
    migrations,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    pool: {
      afterCreate(conn, cb) {
        conn.run('PRAGMA foreign_keys = ON', cb);
      },
    },
    useNullAsDefault: true,
    migrations,
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations,
  },
};
