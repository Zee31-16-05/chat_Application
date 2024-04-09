const router = require('express').Router();
const {
    authMiddleware
} = require('../middleware/authMiddleware');
const {
    getFriends,
    messageUploadDB,
    messageGet,
    ImageMessageSend,messageSeen,deliveredMessage
} = require('../controller/messengerController');
const {
    upload
} = require('../utils/messageMulter')

router.get('/get-friends', authMiddleware, getFriends);
router.post('/send-message', authMiddleware, messageUploadDB);
router.get('/get-message/:id', authMiddleware, messageGet);
router.post('/image-message-send', upload.single('image'), authMiddleware, ImageMessageSend);

router.post('/seen-message',authMiddleware, messageSeen);
router.post('/delivered-message',authMiddleware, deliveredMessage);

module.exports = router;