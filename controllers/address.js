const Address = require('../models/address')

exports.newAddress = async (req, res) => {

    try {

        const userId = req.auth._id
        const firebaseId = req.auth.user.firebaseId

        const {
            pincode,
            city,
            houseNumber,
            locality,
            street,
            landmark,
            type,
            state,
            firstName,
            lastName,
            mobileNumber
        } = req.body

        const address = new Address({
            userId,
            firebaseId,
            pincode,
            city,
            houseNumber,
            locality,
            street,
            landmark,
            type,
            state,
            firstName,
            lastName,
            mobileNumber
        })

        const save = await address.save()

        res.json({
            success: true,
            dbRes: save
        })

    }catch(err) {

        res.status(400).json({
            error: true,
            message: err
        })
    }

}

exports.updateAddress = async (req, res) => {

    try {


    }catch(err) {

        res.status(400).json({
            error: true,
            message: err
        })
    }

}

exports.getAddress = async (req, res) => {

    try {

        const { addressId } = req.params

        const address = await Address
            .findOne({ _id: addressId })

        res.json({
            success: true,
            dbRes: address
        })

    }catch(err) {

        res.status(400).json({
            error: true,
            message: err
        })
    }

}

exports.deleteAddress = async (req, res) => {

    try {


    }catch(err) {

        res.status(400).json({
            error: true,
            message: err
        })
    }

}

exports.getAllAddress = async (req, res) => {

    try {
        const address = await Address
        .find()

        res.json({
            success: true,
            dbRes: address
        })


    }catch(err) {

        res.status(400).json({
            error: true,
            message: err
        })
    }

}
