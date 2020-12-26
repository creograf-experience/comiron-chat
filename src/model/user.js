const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jwt = require('jsonwebtoken');
const config = require('../config');

const UserSchema = new Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },

  firstName: {
    type: String,
    default: ''
  },

  lastName: {
    type: String,
    default: ''
  },

  avatar: {
    type: String,
    default: config.defaultAvatar
  },

  comironUserId: String,

  pushTokens: {
    type: Array,
    default: []
  }

}, { timestamps: true });

UserSchema.methods.generateJwt = function () {
  const payload = {
    _id: this._id,
    phone: this.phone
  };

  return jwt.sign(payload, config.jwtSecret);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
