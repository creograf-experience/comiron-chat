const router = require('express').Router();
const authController = require('../../controller/user/auth');

router.post('/save-phone', authController.savePhone);
router.post('/is-verified', authController.isVerified);

module.exports = router;