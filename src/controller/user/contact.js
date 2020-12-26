const User = require("../../model/user");
const Contact = require("../../model/contact");
const contactService = require("../../service/contact");


exports.addContacts = async (req, res) => {
  try {
    const { contacts } = req.body;
    const { _id: userId } = req.user;

    if (!contacts) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    if (!contacts.length) {
      return res.status(200).json({ message: 'OK - contact array is empty' });
    }

    const formattedContacts = await contactService.reduceContacts(contacts);
    const phonesToFindInDB = await contactService.extractPhones(formattedContacts);

    const users = await User.find({ phone: { $in: phonesToFindInDB } }, 'phone');
    const existedUsersPhones = users.reduce((acc, user) => [...acc, user.phone], []);

    const markedContacts = await contactService.markExistingUsers(formattedContacts, existedUsersPhones);

    await Contact.deleteMany({userId});
    const promises = markedContacts.map(contact => Contact.create({ user: userId, ...contact }));
    await Promise.all(promises);

    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
}

exports.getContacts = async (req, res) => {
  try {
    const { _id } = req.user;
    const contacts = await Contact.find({ user: _id });

    return res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
}

