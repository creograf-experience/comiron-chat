'use strict';

const events = {
  CONNECT: 'connect',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'err',
  INIT_USER: 'init user',
  RECEIVE_INIT_USER:'receive init user',
  CREATE_CHAT: 'create chat',
  SENDER_CHAT: 'sender chat',
  RECEIVER_CHAT: 'receiver chat',
  CREATE_MESSAGE: 'create message',
  RECEIVE_MESSAGE: 'receive message',
  RECEIVE_PRIVATE_MESSAGE: 'receive private message',
  DELETE_MESSAGE: 'delete message',
  CLEAR_NOTIFICATION: 'clear notification'
}

module.exports = Object.freeze(events);