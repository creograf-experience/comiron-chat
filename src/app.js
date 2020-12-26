const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const morgan = require("morgan");

const config = require("./config/index");
const { errorHandler } = require("./middleware/errorHandler");
require('./config/passport')(passport);

const app = express();

app.use(morgan(config.env));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(passport.initialize());
app.use(errorHandler);
app.use(cors());

app.use(require('./api'));

app.use(express.static(path.resolve(__dirname, '..', 'public')));

module.exports = app;