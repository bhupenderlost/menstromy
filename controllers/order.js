const Order = require('../models/order')


const { createOrderRzp, capturePaymentRzp } = require('./payment')

exports.createOrder = async (req, res) => {

    try {
        const { addressId } = req.body

        const userId = req.auth._id
        const firebaseId = req.auth.user.firebaseId

        const rzpOrder = await createOrderRzp(req.auth._id)
        const order = new Order({
            firebaseId,
            userId,
            products: rzpOrder.products,
            rzpOrder: rzpOrder.rzpOrder,
            payment_status: "pending",
            payment_type: "online",
            address: addressId
        })

        const save = await order.save()

        res.json({
            success: true,
            dbRes: save
        })

    } catch (err) {
        res.status(400).json({
            error: true,
            message: err
        })

    }
}

exports.getAllOrders = async (req, res) => {

    const { page, limit, type } = req.query

    const userId = req.auth._id

    const options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { _id: 1, createdAt: -1 },
        select: "_id payment_type payment_status order_status rzpOrder"
    }

    const query = {
        userId: userId
    }

    { type ? query.order_status = type : null }

    try {
        let orders = await Order.paginate(query, options)
        res.json({
            success: true,
            orders
        })
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err
        })
    }
}

exports.getOrder = async (req, res) => {

    try {

        const { orderId } = req.params
        const userId = req.auth._id

        const order = await Order
            .findOne({
                userId: userId,
                _id: orderId
            }).populate("products.productId address")

        res.json({
            success: true,
            dbRes: order
        })

    } catch (err) {

        res.status(400).json({
            error: true,
            message: err
        })

    }
}

exports.cancelOrder = async (req, res) => {

    try {

        const { orderId } = req.body
        const userId = req.auth._id

        const order = await Order
            .findOneAndUpdate({
                userId: userId,
                _id: orderId
            },
                {
                    order_status: "cancel"
                },
                {
                    new: true
                })

        res.json({
            success: true,
            dbRes: order
        })

    } catch (err) {

        res.status(400).json({
            error: true,
            message: err
        })

    }
}

exports.paymentChecker = async (req, res) => {

    try {

        const {
            orderId,
            paymentId
        } = req.body

        const userId = req.auth._id

        const order = await Order
            .findOne({
                _id: orderId,
                userId: userId,
                payment_status: "pending",
                order_status: "ok"
            })

        if (!order)
            return res.status(404).json({
                error: true,
                message: '404 Not Found'
            })
        const rzpBody = {
            orderId: order.rzpOrder.id,
            paymentId: paymentId
        }

        const rzp = await capturePaymentRzp(rzpBody)
        if(rzp.error) {
            return res.status(400).json({
                error: true,
                message: "An Error Occured"
            })
        }
        if (rzp.rzpCapture.status === 'captured') {
            const updateOrder = await Order
                .findOneAndUpdate({
                    _id: order._id
                },
                    {
                        payment_id: paymentId,
                        payment_status: "success",
                        rzpOrder: rzp.rzpOrder
                    },
                    {
                        new: true
                    })

            res.json({
                success: true,
                message: `Your order number is: ${order._id}`,
                dbRes: updateOrder
            })
        } else {

            res.status(400).json({
                error: true,
                message: "Error Occured",
                errorObject: rzp.toString()
            })

        }

    } catch (err) {
        res.status(400).json({
            error: true,
            message: err.toString(),
            errorObject: err
        })

    }

}