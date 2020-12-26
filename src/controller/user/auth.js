const User = require("../../model/user");
const validate = require("../../utils/validate");
const utils = require("../../utils/utils");
const axios = require('axios');


exports.savePhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !validate.phoneNumber(phone)) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const rawPhone = utils.extractPhoneNumber(phone);

    const user = await User.findOne({ phone: rawPhone });
    if (user) {
      return res.status(200).json({ message: 'User exists, continue' });
    }

    await User.create({ phone: rawPhone });

    return res.status(200).json({ message: 'User saved' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

exports.isVerified = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !validate.phoneNumber(phone)) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const rawPhone = utils.extractPhoneNumber(phone);

    const user = await User.findOne({ phone: rawPhone });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // TODO: сотрудник ли Комироновский?
    const { data } = await axios.post(
      'https://comironserver.comiron.com/profile/partizan',
      {
        phone: user.phone,
        partizan_uid: user._id
      }
    );

    if (data.success && data.id) {
      user.comironUserId = data.id;
    }

    const jwtToken = user.generateJwt();
    return res.status(200).json({
      isVerified: true,
      jwtToken: 'Bearer ' + jwtToken
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}