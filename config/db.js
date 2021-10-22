const mongoose = require('mongoose');
const config = require('.');

const env = process.env.NODE_ENV || 'development';
const connectString = config[env].DB_URL;

mongoose.Promise = global.Promise;

mongoose.connect(connectString, { useNewUrlParser: true });

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});
