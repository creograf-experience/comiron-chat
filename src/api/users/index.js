const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/contacts', require('./contact'));
router.use('/chats', require('./chat'));
router.use('/messages', require('./message'));
router.use('/pushtokens', require('./pushToken'));

module.exports = router;