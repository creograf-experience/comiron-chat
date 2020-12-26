const router = require('express').Router();
const passport = require('passport');
const pushTokenController = require('../../controller/user/pushToken');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  pushTokenController.add
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  pushTokenController.delete
);


module.exports = router;
