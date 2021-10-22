moduke.exports = {
  development: {
    DB_URL: 'mongodb://mongodb/crud_users_dev',
    APP_ENV: 'development',
  },
  production: {
    DB_URL: 'mongodb://mongodb/crud_users',
    APP_ENV: 'production',
    NODE_ENV: 'production',
  },
  test: {
    DB_URL: 'mongodb://mongodb/crud_users_test',
    APP_ENV: 'test',
    NODE_ENV: 'production',
  },
};
