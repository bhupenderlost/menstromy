const { Schema, model, default: mongoose } = require("mongoose");

const userSessions = Schema({
    ipAddress: Number,
    deviceName: String
}, { timestamps: true })

const userSchema = Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true

    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    dateOfBirth: {
        type: String,
        required: false
    },
    subscriptions: [],
    userType: {
        type: String,
        enum: ['', 'partner', 'self'],
        default: ''
    },
    // partner: {
    //     type: mongoose.ObjectId,
    //     required: false,
    //     ref: 'User',
    // },
    firebaseId: {
        type:String,
        required: true,
        unique: true
    },
    sessions: [userSessions]
}, { timestamps: true })

const User = model('User', userSchema)

module.exports = User