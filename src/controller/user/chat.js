const Chat = require("../../model/chat");


exports.getAll = async (req, res) => {
  try {
    const { phone } = req.user;

    const chats = await Chat
      .find({ "users.phone": phone })
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    return res.status(200).json(chats);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
}
