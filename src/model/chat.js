const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = mongoose.Schema;


const ChatSchema = new Schema({
  creatorPhone: {
    type: String,
    required: true
  },

  // все кто в чате
  users: [
    {
      phone: {
        type: String
      },
      contactName: {
        type: String
      },
      avatar: {
        type: String
      },
      position: {
        type: String
      }
    }
  ],

  // hash телефонов чата, для проверки уникальности
  phonesHash: {
    type: Number
  },

  shop: {
    type: Object
  },

  latestMessage: {
    type: Types.ObjectId,
    ref: 'Message'
  },

  notificationCount: {
    type: Number,
    default: 0
  },

}, { timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
