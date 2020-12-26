exports.phoneNumber = phone =>
  phone.length >= 11 && /^[+]?\d+$/.test(phone);
