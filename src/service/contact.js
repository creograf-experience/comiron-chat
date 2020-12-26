const utils = require("../utils/utils");

const reduceContacts = async contacts => contacts.reduce((acc, contact) => {
  const { name, phoneNumbers } = contact;
  if (!name || !phoneNumbers || !phoneNumbers.length) {
    return acc;
  }

  const newContact = createContact(contact);
  if (!newContact.phoneNumbers.length) {
    return acc;
  }

  return [...acc, newContact];
}, []);

const extractPhones = async arr =>
  arr.reduce((acc, item) =>
    [...acc, ...item.phoneNumbers.map(phone => phone.number)], []
  );


const createPhoneNumbers = data =>
  data.reduce((acc, phone) => {
    const number = utils.formatPhone(phone.number);

    if (number.length < 11) return acc;

    return [...acc, { number }];
  }, []);

const createContact = data => {
  return {
    id: data.id,
    name: data.name,
    phoneNumbers: utils.uniqueArrayOfObjects(createPhoneNumbers(data.phoneNumbers), 'number'),
  };
};

const markExistingUsers = async (contacts, users) =>
  contacts.map(contact => {
    let userExists = false;

    const phoneNumbers = contact.phoneNumbers.map(phone => {
      if (!users.includes(phone.number)) {
        return { ...phone, phoneExists: false };
      }

      userExists = true;
      return { ...phone, phoneExists: true };
    });

    return {
      ...contact,
      phoneNumbers,
      userExists
    };
  });

module.exports = {
  extractPhones,
  createPhoneNumbers,
  createContact,
  reduceContacts,
  markExistingUsers
};
