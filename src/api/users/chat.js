const router = require('express').Router();
const passport = require('passport');
const chatsController = require('../../controller/user/chat');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  chatsController.getAll
);

module.exports = router;