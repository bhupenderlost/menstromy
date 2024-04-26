const express = require('express')
const { 
    createOrder, 
    getOrder, 
    getAllOrders, 
    cancelOrder, 
    paymentChecker
} = require('../controllers/order')


const router = express.Router()


router.post('/create', createOrder)

router.get('/get/:orderId', getOrder)

router.get('/orders', getAllOrders)

router.put('/cancel', cancelOrder)

router.post('/payment-check', paymentChecker)

module.exports = router