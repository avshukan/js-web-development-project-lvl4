#! /usr/bin/env node
import Rollbar from 'rollbar';
import getApp from '../index.js';

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_KEY,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const port = process.env.PORT || 5000;
const host = (process.env.MODE === 'DEV') ? 'localhost' : '0.0.0.0';

app.listen(port, host, (error, address) => {
  rollbar.log('Hello world!');
  console.log('NODE_ENV', process.env.NODE_ENV);
  console.log(`Server is running on port: ${port}`);
  console.log(`wsl hint: http://172.17.137.19:${port}`);
  if (error) {
    rollbar.error(error);
    console.error('address', address);
    app.log.error(error);
    process.exit(1);
  }
});
