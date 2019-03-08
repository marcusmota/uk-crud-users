
const mongoose = require('mongoose');

require('dotenv').config();

const { DB_USER, DB_PASSWORD } = process.env;
const env = process.env.NODE_ENV;
const debug = env === 'DEV' ? true : false;
let db = null;

if(env === "DEV"){
    db = "crud_users_dev";
}else if(env === "TEST"){
    db = "crud_users_test";
}else {
    db = "crud_users";
}

const connectString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@uk-recruitment-j6l34.mongodb.net/${db}?retryWrites=true`;

console.log(connectString);

mongoose.Promise = global.Promise;

mongoose.connect(connectString, { useNewUrlParser: true });

mongoose.set('debug', debug);

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
});