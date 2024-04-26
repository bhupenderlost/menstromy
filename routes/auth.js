const express = require('express')
const { 
    signIn, 
    signUp, 
} = require('../controllers/user')

const router = express.Router()

//POST REQUESTs
router.post('/signin', signIn)
router.post('/signup', signUp)


module.exports = router