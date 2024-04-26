const express = require('express')
const { 
    getProfile,
    updateProfile,
    checkAuthorization,
    verifyToken
} = require('../controllers/user')

const router = express.Router()

//POST REQUESTs
router.post('/verify-token', verifyToken)

//GET REQUESTs
router.get('/profile', getProfile)

//DELETE REQUESTs
router.delete('/user')

//PUT REQUESTs
router.put('/update', updateProfile)

module.exports = router