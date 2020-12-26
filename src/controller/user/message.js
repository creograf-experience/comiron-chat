const Message = require('../../model/message');

exports.get = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip) || 0;

    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const messages = await Message
      .find({ chat: chatId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json(messages.reverse());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};
