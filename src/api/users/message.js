const router = require('express').Router();
const passport = require('passport');
const messagesController = require('../../controller/user/message');

router.get(
  '/:chatId',
  passport.authenticate('jwt', { session: false }),
  messagesController.get
);

module.exports = router;
