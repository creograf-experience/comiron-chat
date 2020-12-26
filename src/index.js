const app = require('./app');
const http = require('http').Server(app);
const socket = require('socket.io')

const { port, socketOpts } = require('./config');
const { CONNECTION } = require('../src/constants/events');
const { startDb } = require("./config/db");

startDb();

const io = module.exports = socket(http, socketOpts);

io.on(CONNECTION, require('./service/socketManager'));

http.listen(port, () =>
  console.log(`Server is listening on port ${port}`)
);
