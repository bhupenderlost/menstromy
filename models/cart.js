const { Schema, model, default: mongoose } = require("mongoose");

const cartItemSchema = Schema({
   productId: {
        type: mongoose.ObjectId,
        ref: 'Product'
   },
   quantity: {
        type: Number
   }
}, { timestamps: true })

const cartSchema = Schema({
   
    userId: {
        type: String,
        required: true,
        unique: true
    },
    firebaseId: {
        type: String,
        required: true,
        unique: true

    },
    cartItems: [cartItemSchema]

}, { timestamps: true })


const Cart = model('Cart', cartSchema)

module.exports = Cart