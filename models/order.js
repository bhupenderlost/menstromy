const { Schema, model, default: mongoose } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const subSchema = Schema({
    productId: {
        type: mongoose.ObjectId,
        ref: 'Product'
    },
    quantity: Number
})
const orderSchema = Schema({
   
    userId: {
        type: String,
        required: true
    },
    firebaseId: {
        type: String,
        required: true

    },
    products: [subSchema],
    payment_type: {
        type: String,
        enum: ["cod", "online"],
        default: "online"
    },
    payment_id: String,
    payment_status: {
        type: String,
        enum: ["success", "refund", "cancelled", "pending"],
        default: "pending"
    },
    rzpOrder: Object,
    address: {
        type: mongoose.ObjectId,
        ref: 'Address'
    },
    order_status: {
        type: String,
        enum: ["cancel", "ok", "delivered"],
        default: "ok"
    }

}, { timestamps: true })

orderSchema.plugin(mongoosePaginate)

const Order = model('Order', orderSchema)

module.exports = Order