const path = require('path');
require('dotenv').config();

const env = process.env;
const avatar = 'https://d1wp6m56sqw74a.cloudfront.net/~assets/7d863f7871b69d2220a9416f584a9883';
const socketOpts = { pingTimeout: 58000, pingInterval: 2000 };
const mongoOpts = { useNewUrlParser: true, useUnifiedTopology: true };

const getDir = (name) => {
  return path.resolve(__dirname, '..', '..', 'public', 'uploads', name);
}

module.exports = {
  env: env.NODE_ENV || 'dev',
  port: env.PORT || 4000,
  hostname: env.HOST_NAME,
  jwtSecret: env.JWT_SECRET,
  encryptionKey: env.ENCRYPTION_KEY,
  signingKey: env.SIGNING_KEY,
  defaultAvatar: avatar,
  socketOpts,
  mongoOpts,

  imageFolder: getDir('img'),
  avatarFolder: getDir('avatar'),
  voiceMessageFolder: getDir('voice'),
  encodedVoiceFolder: getDir('encoded-voice'),

  dev: {
    db: `mongodb://localhost/${ env.DB_NAME }`
  },

  test: {
    db: 'mongodb://localhost/comiron-chat-test'
  },

  production: {
    db: `mongodb://localhost/${ env.DB_NAME }`
  }
}
