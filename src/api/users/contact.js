const router = require('express').Router();
const passport = require('passport');
const contactsController = require('../../controller/user/contact');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  contactsController.getContacts
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  contactsController.addContacts
);

module.exports = router;