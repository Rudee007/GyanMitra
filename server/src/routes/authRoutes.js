const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const {register,verifyEmail,login,googleAuth,getUserInfo,resendVerification,checkVerification} = require('../controllers/authController');
const router = express.Router();


router.post('/signup', register);
router.get ('/verify',  verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/check-verification', checkVerification); // Mobile polls this
router.post('/login',  login);
router.post('/google',  googleAuth);
// router.get('/user-info',  getUserInfo);


module.exports = router;