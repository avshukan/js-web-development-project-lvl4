#! /usr/bin/env node

import getApp from '../index.js';

const port = process.env.PORT || 5000;
const host = (process.env.MODE === 'DEV') ? 'localhost' : '0.0.0.0';
const app = getApp();

app.listen(port, host, (error, address) => {
  console.log(`Server is running on port: ${port}`);
  if (error) {
    console.log('address', address);
    app.log.error(error);
    process.exit(1);
  }
});
