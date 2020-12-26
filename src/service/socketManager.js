const jwt = require("jsonwebtoken");

const io = require("../index");
const config = require("../config");
const User = require("../model/user");
const Chat = require("../model/chat");
const Message = require("../model/message");
const chatService = require("../service/chat");
const messageService = require("../service/message");
const { notify } = require("../service/notification");
const utils = require("../utils/utils");
const {
  DISCONNECT,
  INIT_USER,
  RECEIVE_INIT_USER,
  CREATE_CHAT,
  ERROR,
  SENDER_CHAT,
  RECEIVER_CHAT,
  CREATE_MESSAGE,
  RECEIVE_MESSAGE,
  RECEIVE_PRIVATE_MESSAGE,
  DELETE_MESSAGE,
  CLEAR_NOTIFICATION
} = require("../constants/events");

const users = new Map();

module.exports = socket => {
  console.log('user connected with socket: ' + socket.id);

  socket.on(DISCONNECT, () => {
    console.log('user disconnected with socket: ' + socket.id);
    users.delete(socket.id);
  });

  socket.on(INIT_USER, async jwtToken => {
    try {
      console.log('init user with socket: ' + socket.id);
      if (!jwtToken) {
        socket.emit('err', 'Invalid data');
        return socket.emit(DISCONNECT);
      }

      const decoded = await jwt.verify(
        jwtToken.replace('Bearer ', ''),
        config.jwtSecret
      );

      const user = await User
        .findById(decoded._id);

      if (!user) {
        console.log('User does not exist');
        socket.emit('err', 'User does not exist');
        return socket.emit(DISCONNECT);
      }

      console.log('user decoded');
      users.forEach((value, key) => {
        if (value.phone === user.phone) {
          console.log('user already exist, disconnect...');
          io.sockets.connected[key].disconnect();
        }
      });

      users.set(socket.id, { id: user._id, phone: user.phone });
      socket.emit(RECEIVE_INIT_USER, user);
    } catch (err) {
      console.error('Not decoded', err);
      return socket.emit(DISCONNECT);
    }
  });

  socket.on(CREATE_CHAT, async data => {
    try {
      const { receiver, content, senderInfo } = data;

      if (!users.get(socket.id)) {
        return socket.emit(ERROR, 'User is not initialized');
      }

      const sender = users.get(socket.id);
      Object.assign(sender, senderInfo);
      const isNewChat = await chatService.isNew(sender, receiver);

      if (!isNewChat) {
        return socket.emit(ERROR, 'Chat already exists');
      }

      const newChat = await chatService.createChat(sender, receiver);

      const message = await messageService.createMessage(newChat, sender, content)

      newChat.latestMessage = message._id;
      newChat.notificationCount += 1;

      await newChat.save();

      const response = await Chat
        .findOne({ _id: newChat })
        .populate('latestMessage');

      socket.emit(SENDER_CHAT, response);

      await sendToReceivers(sender.phone, response, response, RECEIVER_CHAT);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on(CREATE_MESSAGE, async data => {
    try {
      const { chatId, sender, content } = data;

      if (!users.get(socket.id)) {
        return socket.emit(ERROR, 'User is not initialized');
      }

      const chat = await Chat.findOne({ _id: chatId });
      const senderUser = await User.findOne({ phone: sender });
      const newMessage = await messageService
        .createMessage(chat, senderUser, content);

      chat.latestMessage = newMessage._id;
      chat.notificationCount += 1;

      const response = await Message
        .findOne({ _id: newMessage._id })
        .populate('chat');

      await chat.save();

      const result = await messageService.attachImageBase64(response);

      socket.emit(RECEIVE_MESSAGE, response);
      await sendToReceivers(senderUser.phone, chat, result, RECEIVE_PRIVATE_MESSAGE);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on(DELETE_MESSAGE, async data => {
    try {
      const { chatId, _id } = data;
      if (!chatId || !_id) {
        return;
      }

      const [chat, message] = await Promise.all([
        Chat.findById(chatId),
        messageService.deleteMessage(_id)
      ])

      if (!chat || !message) {
        return;
      }

      if (String(chat.latestMessage) !== String(message._id)) {
        return;
      }

      const previousMessage = await messageService.getPreviousMessage(chatId);
      chat.latestMessage = previousMessage ? previousMessage._id : null;

      await chat.save();
    } catch (error) {
      console.error(error);
    }
  });

  socket.on(CLEAR_NOTIFICATION, async chatId => {
    try {
      if (!chatId) {
        return socket.emit('err', 'Invalid data');
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        return socket.emit('err', 'Chat does not exist');
      }

      chat.notificationCount = 0;
      await chat.save();
    } catch (err) {
      console.error(err);
    }
  });
};

const sendToReceivers = async (excludePhone, chat, response, event) => {
  const receivers = getReceivers(chat, excludePhone) || [];

  if (receivers[0]) {
    receivers.forEach(it => io.to(it).emit(event, response))
  } else {
    const to = getChatUsersExceptSender(chat, excludePhone);
    to.forEach(it => notify(it.phone, response))
  }
};

const getReceivers = (chat = {}, exclude) => {
  const to = getChatUsersExceptSender(chat, exclude);

  return to.map(user => utils.getSocketByPhone(user.phone, users)) || [];
};

const getChatUsersExceptSender = (chat = {}, exclude) =>
  chat.users.filter(user => user.phone !== exclude) || [];