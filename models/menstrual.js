const { Schema, model, default: mongoose } = require("mongoose");

const menstrualDetails = Schema({
    periodStart: {
        type: Number,
    },
    periodEnd: {
        type: Number,
    }
}, { timestamps: true })

const menstrualCycle = Schema({
    firebaseId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    menstrualDetails: [menstrualDetails],
    cycleLength: {
        type: Number,
        required: true
    },
    periodLength: {
        type: Number,
        required: true
    },
    nextPeriod : {
        type: Number,
        required: false,
        default: 0
    }

}, { timestamps: true })


const Menstrual = model('Menstrual', menstrualCycle)

module.exports = Menstrual