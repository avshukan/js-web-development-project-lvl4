// @ts-check

const path = require('path');

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

const {
  LOCAL_PG_HOST,
  LOCAL_PG_PORT,
  LOCAL_PG_BASE,
  LOCAL_PG_USER,
  LOCAL_PG_PASS,
  DATABASE_URL,
} = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: LOCAL_PG_HOST,
      port: LOCAL_PG_PORT,
      database: LOCAL_PG_BASE,
      user: LOCAL_PG_USER,
      password: LOCAL_PG_PASS,
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
      url: DATABASE_URL,
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations,
  },
};
