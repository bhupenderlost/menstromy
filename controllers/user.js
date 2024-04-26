const User = require('../models/user')
const firebaseAdmin = require('firebase-admin')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

//Private Key For JWT Signing
const privateKey = fs
    .readFileSync(
        path.join(
            __dirname, 
            '..', 
            'keys', 
            'private.key'
        ),
        'utf-8'
    )

//SignIn Function
exports.signIn = async (req, res) =>  {
    //Destructure req.body
    const { 
        firebaseToken 
    } = req.body
    //Try-Catch Block
    try {
        //Decode Token
        const decodedToken = await firebaseAdmin
            .auth()
            .verifyIdToken(firebaseToken)
        //If Error 
        if(!decodedToken)
            return res.status(401).json({
                error: true,
                message: "Unauthorized"
            })

        //Find User In Database
        let user = await User
            .findOne({ firebaseId: decodedToken.uid })
        //If No User
        if(!user) 
            return res.status(401).json({
                error: true,
                message: "Unauthorized"
            })

        //Signing JWT Token
        const jwtToken = jwt.sign(
            {
                _id: user._id, //User ID
                user: {
                    firebaseId: user.firebaseId, //Firebase UID
                    firstName: user.firstName, //User firstName
                }
            },
            privateKey, //Private Key
            {
                algorithm: 'RS256', //Algorithm
                allowInsecureKeySizes: true, //Must Be False In Production
                expiresIn: '60d' //Expiry 
            }
        )
        //Success
        res.json({
            success: true,
            token: jwtToken,
            dbRes: user
        })

    }catch(err) {
        //On Error 
        res.status(400).json({
            error: true,
            message: err
        })
    }
}

//Update Function
exports.updateProfile = async (req, res) => {
    
    //Try-Catch Block
    try {
        //Destructure req.body
        const { 
            update 
        } = req.body
        //UserId From AUTH 
        const userId = req.auth._id
        console.log(userId)
        //Santization Of Data
        let sanitizedData = {}
        update.firstName ? sanitizedData.firstName = update.firstName.toString() : null
        update.lastName ? sanitizedData.lastName = update.lastName.toString() : null
        update.dateOfBirth ? sanitizedData.dateOfBirth = parseInt(update.dateOfBirth) : null
        update.userType ? sanitizedData.userType = update.userType.toString() : null
        update.partner ? sanitizedData.partner = update.partner.toString() : null
        update.username ? sanitizedData.username = update.username.toString() : null
        //Update The User
        let updateUser = await User
            .findOneAndUpdate({ _id: userId }, { $set: sanitizedData }, { new: true })
        //If Error
        if(!updateUser)
            return res.status(400).json({
                error: true,
                message: 'Unexpted Error Occured'
            })
        //Success
        res.json({
            success: true,
            message: 'Updated Successfully!',
            dbRes: updateUser

        })
    }catch(err) {
        //On Error
        res.status(400).json({
            error: true,
            message: err
        })
    }
}

//SignUp Function
exports.signUp = async (req, res) => {
    //Destructure req.body
    const { 
        firebaseToken 
    } = req.body
    //Try-Catch Block
    try {
        //Decode Token
        const decodedToken = await firebaseAdmin
            .auth()
            .verifyIdToken(firebaseToken)
        //If Error
        if(!decodedToken) 
            return res.status(401).json({
                error: true,
                message: "Unauthorized"
            })

        //Find User If Exists
        let user = await User
            .findOne({ firebaseId: decodedToken.uid })
        //If Exists 
        if(user) 
            return res.status(403).json({
                error: true,
                message: "Account Already Exists!"
            })
        

        //Get User Details From Firebase
        let getUserDetails = await firebaseAdmin
            .auth()
            .getUser(decodedToken.uid)

        //If Error
        if(!getUserDetails)
            return res.status(404).json({
                error: true,
                message: `Cannot find user with the UID: ${decodedToken.uid}`
            })

        //New User
        let newUser = new User({
            firstName: getUserDetails.displayName,
            lastName: '',
            email: getUserDetails.email,
            username: getUserDetails.email.split('@')[0],
            firebaseId: getUserDetails.uid
        })
        //Save User
        let save = await newUser
            .save()
        //If Error
        if(!save) 
            return res.status(400).json({
                error: true,
                message: "Error creating user!"
            })
        //Signing JWT Token
        const jwtToken = jwt.sign(
            {
                _id: save._id, //User ID
                user: {
                    firebaseId: save.firebaseId, //Firebase UID
                    firstName: save.firstName, //User firstName
                }
            },
            privateKey, //Private Key
            {
                algorithm: 'RS256', //Algorithm
                allowInsecureKeySizes: true, //Must Be False In Production
                expiresIn: '60d' //Expiry 
            }
        )
        //Success
        res.json({
            success: true,
            token: jwtToken,
            dbRes: save,
            addDetails: true
        })

    }catch(err) {
        //On Error
        res.status(400).json({
            error: true,
            message: err
        })
    }
}

//Get Profile Function
exports.getProfile = async (req, res) => {
    //Destructure req.auth
    let { 
        _id 
    } = req.auth
    //Destructure req.query
    const { 
        partner 
    } = req.query
    //Try-Catch Block
    try {
        //Find User
        const user = await User
            .findOne({ _id: _id })
        //If Partner Query
        if(partner) {
            //Find Details Of Partner
            const partnerDetails = await User
                .findOne({ _id: user.partner._id })
            //Success
            res.json({
                success: true,
                dbRes: partnerDetails
            })
        }else 
            //Sucess
            res.json({
                success: true,
                dbRes: user
            })
    }catch(err) {
        //On Error
        res.status(400).json({
            error: true,
            message: err
        })
    }
}

//Verify Token
exports.verifyToken = async (req, res) => {
    res.json({
        success: true,
        message: "Token is valid!"
    })
}

//Check Authorization Function
exports.checkAuthorization = async (req) => {
    //Destructure req.auth
    let { 
        _id 
    } = req.auth
    //Try-Catch Block
    try {
        //Find User
        let user = await User
            .findOne({ _id: _id })
        //Exists
        if(user)
            return true //TRUE
    
        //Does'nt Exist
        return false //FALSE
    }catch(err) {
        //On Error 
        return false //FALSE
    }
   
}
