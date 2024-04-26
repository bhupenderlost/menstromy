const Blog = require('../models/blog')



exports.newPost = async (req, res) => {

    try {
        const { 
            title,
            slug,
            excerpt,
            content,
            thumbnail
        } = req.body

        const post = new Blog({
            title,
            slug,
            excerpt,
            content,
            thumbnail
        })
        let newpost = await post
            .save()

        res.json({
            success: true,
            dbRes: newpost
        })
    }catch(err) {
        res.status(400).json({
            error: true,
            message: err
        })
    }
}

exports.updatePost = async (req, res) => {

}

exports.deletePost = async (req, res) => {

}

exports.getPosts = async (req, res) => {
    const { page, limit } = req.query

    const options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { _id: 1, createdAt: -1 },
    }

    try {
        let blog = await Blog.paginate({}, options)
        res.json({
            success: true,
            posts:blog
        })
    }catch(err) {
        res.status(400).json({
            error:true,
            message: err
        })
    }
}

exports.getPost = async (req, res) => {
    const { slug } = req.params

    try {
        let blog = await Blog.findOne({ slug: slug })
        if(!blog)
            return res.status(404).json({
                error: true,
                message: "404 Error"
            })
        
        res.json({
            success: true,
            post: blog
        })
    }catch(err) {
        res.status(400).json({
            error:true,
            message: err
        })
    }
}

