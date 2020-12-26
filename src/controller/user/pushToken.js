const User = require('../../model/user');

exports.add = async (req, res) => {
  try {
    const { token } = req.body;
    const { _id } = req.user;

    const user = await User.findById(_id);

    if (!token) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    if (user.pushTokens.includes(token)) {
      return res.status(200).json({ message: 'PushToken already exists, continue' });
    }

    user.pushTokens.push(token);
    await user.save();

    return res.status(200).json({ message: 'Push token was added' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { token } = req.body;
    const { _id } = req.user;

    if (!token) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const user = await User.findById(_id);

    user.pushTokens = user.pushTokens.filter(it => it !== token);

    await user.save();

    return res.status(200).json({ message: 'Push token was deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
}