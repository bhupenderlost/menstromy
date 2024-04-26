const Razorpay = require('razorpay')
const Cart = require('../models/cart')

const rzpInstance = new Razorpay({
    key_id: 'rzp_test_UygYfS9TeNaaTj',
    key_secret: 'g1tSltJ1hq4XaKf2JkShWFaS'
})

exports.capturePaymentRzp = async (rzpBody) => {

    try {

        const { 
            paymentId, 
            orderId 
        } = rzpBody

        const rzpOrder = await rzpInstance
            .orders
            .fetch(orderId)
        const rzpCapture = await rzpInstance
            .payments
            .capture(
                paymentId, 
                rzpOrder.amount, 
                rzpOrder.currency
            )
        return {rzpCapture, rzpOrder}

    }catch(err) {
        if(err.statusCode === 404) 
            return { error: true, type: 404 }
        else 
           return err

    }
}

exports.getOrderRzp = async (req, res) => {

    try {
        const { orderId } = req.body
        
        const rzpOrder = await rzpInstance.orders.fetch(orderId)
        
        return rzpOrder

    }catch(err) {

       return err

    }
}

exports.createOrderRzp = async (userId) => {

    try {
    
        const cart = await Cart.findOne({ userId: userId }).populate("cartItems.productId")
        let price = 0
        cart.cartItems.map((item) => {
            price = price + ( item.productId.productPrice  * item.quantity )
        })
        const order = {
            amount: price * 100,
            // amount: ( ( ( price * 100 ) * 18 / 100 ) + ( price * 100 ) * 2 / 100 ) + ( ( price * 100 ) * 18 / 100 ) + ( price * 100 ) ,
            currency: "INR",
            receipt: `${cart._id}_`,
            notes: {
                description: `ORDER`
            }
        }
        let rzpOrder = await rzpInstance.orders.create(order)

        return { rzpOrder, products: cart.cartItems }

    }catch(err) {

        return err

    }
}

