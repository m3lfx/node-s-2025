const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { registerUser, loginUser } = require('../controllers/user')

router.post('/register', registerUser)
router.post('/login', loginUser)
module.exports = router

