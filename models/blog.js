
const { Schema, model, default: mongoose } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')


const blogSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    excerpt: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
    },
    thumbnail: {
        type: String,
        required: true,
    }

}, { timestamps: true })

blogSchema.plugin(mongoosePaginate)

const Blog = model('Blog', blogSchema)

module.exports = Blog