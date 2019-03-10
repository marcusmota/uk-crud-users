const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('express-validator');

const app = express();
const PORT = 3000;

require('dotenv').config();

const dbJson = require('./config/db.json');
const userRoutes = require("./routes/User");
const env = process.env.NODE_ENV || "DEV";
const APP_NAME = process.env.APP_NAME || "UK-RECRUITMENT-API";
const dbUrl = dbJson[env].DB_URL;

app.use(validator())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

require('./config/db');

userRoutes(app);

app.use("/", (req, res) => res.status(404).send("Endpoints not found, please, read the documentation to see the available endpoints"))

if(!module.parent) {
  app.listen(PORT, () => {
    console.log(`\n
            APP: ${APP_NAME}
            Port: ${PORT}
            env: ${env}
            DB: ${dbUrl}
            Date: ${new Date()}
           \n`)
  })
}


module.exports = app;
