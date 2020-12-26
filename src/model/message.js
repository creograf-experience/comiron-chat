const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const Schema = mongoose.Schema;
const { Types } = mongoose.Schema;

const config = require('../config');


const MessageSchema = new Schema({
  chat: {
    type: Types.ObjectId,
    ref: 'Chat',
    required: true
  },

  sender: String,

  uuid: String,

  content: {
    message: String,
    attachments: {
      photo: String,
      voiceMessage: String
    }
  },

}, { timestamps: true });

MessageSchema.plugin(
  encrypt,
  {
    encryptionKey: config.encryptionKey,
    signingKey: config.signingKey,
    encryptedFields: ['content']
  }
);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
