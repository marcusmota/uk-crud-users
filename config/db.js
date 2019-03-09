
const mongoose = require('mongoose');

require('dotenv').config();

const { DB_CONNECT_URL } = process.env;
const env = process.env.NODE_ENV;
const debug = env === 'DEV' ? true : false;
let db = null;

if(env === "DEV"){
    db = "crud_users_dev?retryWrites=true";
}else if(env === "TEST"){
    db = "crud_users_test?retryWrites=true";
}else {
    db = "crud_users?retryWrites=true";
}

const connectString = `${DB_CONNECT_URL}/${db}`;

mongoose.Promise = global.Promise;

mongoose.connect(connectString, { useNewUrlParser: true });

mongoose.set('debug', debug);

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
});