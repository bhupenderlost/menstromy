const { Schema, model, default: mongoose } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')
const productSchema = Schema({
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        default: 0
    },
    availableUnits: {
        type: Number,
        default: 0
    },
    productImages: [],
    productType: {
        type: String,
        enum: ["Service", "Physical"]
    }

}, { timestamps: true })

productSchema.plugin(mongoosePaginate)

const Product = model('Product', productSchema)

module.exports = Product