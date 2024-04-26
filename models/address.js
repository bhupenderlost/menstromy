const { Schema, model, default: mongoose } = require("mongoose");


const addressSchema = Schema({
   
    userId: {
        type: String,
        required: true
    },
    firebaseId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    pincode : {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    houseNumber: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    landmark : {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true,
        enum: ["office", "home"]
    }

}, { timestamps: true })


const Address = model('Address', addressSchema)

module.exports = Address