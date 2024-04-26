const express = require('express')
const { addToCart, getCart, removeFromCart } = require('../controllers/cart')


const router = express.Router()

router.post('/add', addToCart)
router.get('/cart', getCart)
router.delete('/remove', removeFromCart)
module.exports = router