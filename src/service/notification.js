const { Expo } = require('expo-server-sdk');
const User = require('../model/user');

const notify = async (phone, chat) => {
  try {
    const expo = new Expo();

    const user = await User.findOne({ phone });
    if (!user || !user.pushTokens.length) {
      return;
    }

    const chunks = expo.chunkPushNotifications(createNotifications(user.pushTokens, chat));

    for await (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk)
    }

  } catch (error) {
    console.error(error);
  }
}

const createNotifications = (pushTokens, chat) =>
  pushTokens.reduce((acc, token) => {
    if (!Expo.isExpoPushToken(token)) {
      return acc;
    }

    const notification = {
      to: token,
      sound: 'default',
      body: 'Вам пришло новое сообщение',
      data: { chat }
    }

    return [...acc, notification]
  }, []);

module.exports = {
  notify
}
