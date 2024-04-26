const express = require('express')
const { 
    getProducts, getProduct,
} = require('../controllers/product')


const router = express.Router()

//POST REQUESTs

//GET REQUESTs
router.get('/product/:productId', getProduct)
router.get('/products', getProducts)
//DELETE REQUESTs

//PUT REQUESTs

module.exports = router