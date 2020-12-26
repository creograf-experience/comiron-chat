const utils = {
  extractPhoneNumber: phone => phone.replace(/\D/g, ""),

  uniqueArrayOfObjects: (arr, field) => {
    const uniqueValues = [...new Set(arr.map(item => item[field]))];

    return uniqueValues.map(phone => ({
      ...arr.find(item => phone === item[field])
    }));
  },

  formatPhone: phone => '7' + phone.replace(/\D/g, '').slice(1),

  getSocketByPhone: (phone, users) => {
    let socket;

    users.forEach((value, key) => {
      if (value.phone === phone) socket = key;
    });

    return socket;
  },

  hashCode: str => (hash(str) + 2147483647) + 1
};

function hash(str) {
  let hash = 0, i = 0, len = str.length;
  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
  }

  return hash;
}

module.exports = utils;
