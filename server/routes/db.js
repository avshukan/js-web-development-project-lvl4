// @ts-check
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default (app) => {
  app
    .get('/db', async (req, res) => {
      try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM test_table');
        console.log('result', result);
        const results = { 'results': (result) ? result.rows : null};
        console.log('results', results);
        res.render('pages/db', results );
        client.release();
      } catch (err) {
        console.error(err);
        res.send("Error " + err);
      }
    })
};
