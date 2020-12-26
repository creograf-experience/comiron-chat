const Chat = require("../model/chat");
const { hashCode } = require("../utils/utils");

async function createChat(sender = {}, receiver = {}) {
  // sender = phone; receiver = phone, contactName
  const chat = await Chat.create({ creatorPhone: sender.phone });
  chat.users.push({ phone: receiver.phone, contactName: receiver.contactName, avatar: receiver.imageReceiver, position: receiver.position });
  chat.users.push({ phone: sender.phone, contactName: sender.contactName, avatar: sender.imageSender, position: null });
  chat.phonesHash = hashCode(sender.phone + receiver.phone);
  chat.shop = receiver.shop;
  await chat.save();

  return chat;
}

async function isNew(sender, receiver) {
  const phonesHashOne = hashCode(sender.phone + receiver.phone);
  const phonesHashTwo = hashCode(receiver.phone + sender.phone);

  const result = await Chat
    .find({
      $or: [
        { phonesHash: phonesHashOne },
        { phonesHash: phonesHashTwo }
      ]
    }) || [];

  return result.length === 0;
}

module.exports = {
  createChat,
  isNew
}