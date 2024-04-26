const Cart = require('../models/cart')
const mongoose = require('mongoose')

exports.getCart = async (req, res) => {
    try {
        const firebaseId = req.auth.user.firebaseId

        const cart = await Cart
            .findOne({
                firebaseId: firebaseId
            }).populate("cartItems.productId")
        let totalPrice = 0
        cart.cartItems.map((item) => totalPrice = totalPrice + (item.productId.productPrice * item.quantity) )
        res.json({
            success: true,
            dbRes: cart,
            totalPrice: totalPrice
        })
    }catch(err) {
        res.status(400).json({
            error:true,
            message: err
        })
    }
}

exports.addToCart = async (req, res) => {
    //Destrture Body
    const { 
        productId,
        quantity
    } = req.body
    //Try-Catch
    try {

        let cart = await Cart
            .findOne({ firebaseId: req.auth.user.firebaseId })
        let sch = {
            productId: productId,
            quantity: quantity ? quantity : 1
        }
        if(!cart) {
            let newcart = new Cart({
                firebaseId: req.auth.user.firebaseId,
                userId: req.auth._id,
                cartItems: [sch]
            })

            let save = await newcart
                .save()

            if(!save) 
                return res.status(400).json({
                    error: true,
                    message: "Unexpted Error"
                })
            else
                return res.json({
                    success: true,
                    cart: save
                })

        }else {
            let updateCart = await Cart
                .findOneAndUpdate({
                    firebaseId: req.auth.user.firebaseId
                }, {
                    $push: { 
                        cartItems: sch
                    }
                }, { new: true })
            res.json({
                success: true,
                message: "Added To Cart",
                dbRes: updateCart
            })

        }
    }catch(err) {
        res.status(400).json({
            error: true,
            message: err
        })
    }

}

exports.removeFromCart = async (req, res) => {
     //Destrture Body
    const { 
        cartItemId
    } = req.body
    //Try-Catch
    try {

       const removeItem = await Cart.findOneAndUpdate(
            { 
                firebaseId: req.auth.user.firebaseId
            },
            { 
                $pull : { 
                    cartItems: { 
                        _id: cartItemId 
                    }
                }
            },
            { safe: true, multi: false, new: true  }
       )
       console.log(removeItem)
       res.json({
            success: true,
            message: `Removed Item From Cart With ID:${cartItemId}`,
            dbRes: removeItem
       })
    }catch(err) {
        console.log(err)
        res.status(400).json({
            error: true,
            message: err
        })
    }
}

