const Message = require("../model/message");
const { v4: uuidV4 } = require("uuid");
const base64Img = require("base64-img");
const config = require("../config");
const path = require("path");
const fs = require("fs").promises;
const mongoose = require("mongoose");
const { Types: { ObjectId } } = mongoose;

const createMessage = async (chat = {}, sender = {}, content = {}) => {
  const { message, attachment, uuid } = content;

  let obj = {
    chat: chat._id,
    sender: sender.phone,
    uuid,
  }

  let _content = {};

  if (message) {
    _content.message = message
  }

  if (attachment && attachment.photo) {
    _content.attachments = {};

    const img = base64Img.imgSync(attachment.photo, config.imageFolder, uuidV4());

    _content.attachments.photo = `${config.hostname}/uploads/img/${path.basename(img)}`;
  }

  obj.content = _content;

  return Message.create(obj);
}

const attachImageBase64 = async (msg) => {
  if (isPhotoExists(msg)) {
    msg.content.attachments.photo = `data:image/jpg;base64,${ await getEncodedImage(msg.content.attachments.photo) }`
  }

  return msg;
}

const deleteMessage = async id => {
  try {
    return isObjectId(id)
      ? await Message.findOneAndDelete({ _id: id })
      : await Message.findOneAndDelete({ uuid: id });
  } catch (error) {
    console.error(error)
  }
}

const getPreviousMessage = async (chatId) => {
  const [result] = await Message.find({ chat: chatId }).sort({ _id: -1 }).limit(1);

  return result;
}

const isObjectId = (id) => {
  if (!id) return false;

  return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;
};

const isPhotoExists = (msg) => {
  return msg &&
    msg.content &&
    msg.content.attachments &&
    msg.content.attachments.photo
}

const getEncodedImage = async (filename) => {
  return await fs.readFile(path.resolve(config.imageFolder, filename), { encoding: 'base64' })
}

module.exports = {
  createMessage,
  deleteMessage,
  getPreviousMessage,
  attachImageBase64
}
