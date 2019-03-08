const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('express-validator');

const app = express();
const PORT = 3000;

const userRoutes = require("./routes/User");

app.use(validator())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

require('./config/db');

userRoutes(app);

if(!module.parent) {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
  })
}


module.exports = app;
