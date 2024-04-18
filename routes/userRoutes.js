const express = require('express');
const { signupController, signinController, updateController, requireSignIn } = require('../controllers/userController');

const router = express.Router();

// SIGNUP || POST 
router.post('/signup', signupController);

// SIGNIN || POST 
router.post('/signin', signinController);

//update
router.put('/update-user', requireSignIn, updateController);

module.exports = router;
