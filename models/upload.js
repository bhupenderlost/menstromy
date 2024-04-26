const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


const uploadSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        requried: true
    },
    fileExt: {
        type: String,
        enum: ['jpg', 'png']
    },
    owner: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
    permissions: {
        type: String,
        enum: ['private', 'public']
    }
}, { timestamps: true })

uploadSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Upload', uploadSchema)
