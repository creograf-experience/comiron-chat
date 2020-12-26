const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  // id контакта на телефоне юзера
  id: {
    type: String
  },

  phoneNumbers: [
    {
      number: String,
      phoneExists: Boolean
    }
  ],

  userExists: {
    type: Boolean,
    required: true
  }

}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
