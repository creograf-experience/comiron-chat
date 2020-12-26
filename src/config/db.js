const mongoose = require('mongoose');
const config = require('./index');

const startDb = () => {
  mongoose
    .connect(config[config.env].db, config.mongoOpts)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));
}

module.exports = {
  startDb
}