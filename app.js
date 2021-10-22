const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('express-validator');
const userRoutes = require('./routes/user');

const app = express();
const PORT = 3000;

require('dotenv').config();

app.use(validator());
app.use(cors());
app.use(express.json());

require('./config/db');

userRoutes(app);

app.use('/', (_request, response) => response.status(404).send({ msg: 'Service not found, please, read the documentation https://github.com/marcusmota/uk-crud-users to see the available endpoints' }));

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`\n
            Server running at port ${PORT}
           \n`);
  });
}

module.exports = app;
