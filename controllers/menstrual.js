const Menstrual = require("../models/menstrual")

exports.periodStart = async (req, res) => {
    try {

        const { periodStart } = req.body
        const { _id } = req.auth
        let update = await Menstrual
            .findOneAndUpdate({ 
                userId: _id
            }, 
            {
                $push: { 
                    menstrualDetails: {
                        periodStart: periodStart,
                        periodEnd: 0
                    }
                }
            }, 
            {
                new: true
            }
        )
        res.json({
            success: true,
            dbRes: update
        })
 
    }catch(err) {
        console.log(err)
        res.status(400).json({
            error: true,
            message: err
        })
    }

}
exports.periodEnd = async (req, res) => {

    try {

        const { periodEnd, periodId } = req.body
        const { _id } = req.auth
        let update = await Menstrual
            .findOneAndUpdate({ 
                userId: _id,
                "menstrualDetails._id": periodId
            }, 
            {
              "$set": {
                "menstrualDetails.$.periodEnd": periodEnd
              }  
            }, 
            {
                new: true
            }
        )
        res.json({
            success: true,
            dbRes: update
        })
 
    }catch(err) {
        res.status(400).json({
            error: true,
            message: err
        })
    }

}

exports.getMenstrual = async (req, res) => {
    try {
        const { _id } = req.auth

        const menstrual = await Menstrual
            .findOne({
                userId: _id
             })

        if(!menstrual)
            return res.status(404).json({
                error: true,
                message: "Content Not Available"
            })
        
        res.json({
            success: true,
            dbRes: menstrual
        })
    }catch(err) {
        res.status(400).json({
            error: true,
            message: err
        })
    }
}

exports.nextPeriod = async (req, res) => {
    try {

        const { _id } = req.auth

        const menstrual = await Menstrual
            .findOne({ 
                userId: _id
            })
        const nextDateUnix = menstrual.menstrualDetails[menstrual.menstrualDetails.length - 1].periodStart + (( menstrual.cycleLength - 1 ) * 24 * 60 * 60)
        res.json({ 
            success: true,
            message: "Next period date is in unix timestamp",
            value: nextDateUnix
        })
    }catch(err) {
        res.status(400).json({
            error:true,
            message: err
        })
    }
}

exports.createMenstrual = async (req, res) => {

    try {

        const { _id, user } = req.auth

        const { cycleLength, periodLength, lastPeriod } = req.body

        const menstrual = new Menstrual({
           
            firebaseId: user.firebaseId,
            userId: _id,
            cycleLength: cycleLength ? cycleLength : 28,
            periodLength: periodLength ? periodLength : 7,
            menstrualDetails: [lastPeriod]
        })
        
        const save = await menstrual    
            .save()

        res.json({
            success: true,
            dbRes: save
        })
    }catch(err) {
        res.status(400).json({
            error:true,
            message: err
        })
    }

    
}

