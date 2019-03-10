
const mongoose = require('mongoose');
const dbJson = require('./db.json');

const env = process.env.NODE_ENV;
const debug = env === 'DEV' ? true : false;

const connectString = dbJson[env].DB_URL;

mongoose.Promise = global.Promise;

mongoose.connect(connectString, { useNewUrlParser: true });

mongoose.set('debug', debug);

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
});
