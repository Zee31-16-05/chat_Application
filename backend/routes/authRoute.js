const {
    Router
} = require('express')
const {
    userRegister,
    userLogin,
} = require('../controller/authCOntroller')
const {
    authMiddleware
} = require('../middleware/authMiddleware');
const {
    upload
} = require('../utils/multer')

const router = Router()

router.post('/user-register', userRegister)
router.post('/user-login', userLogin);

module.exports = router