const Product = require("../models/product")

exports.getProducts = async (req, res) => {
    const { page, limit, type } = req.query

    const options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { _id: 1, createdAt: -1 },
    }
    const query = {}
    {type ? query.productType = type : null}
    try {
        let products = await Product.paginate(query, options)
        res.json({
            success: true,
            products:products
        })
    }catch(err) {
        res.status(400).json({
            error:true,
            message: err
        })
    }
}

exports.getProduct = async (req, res) => {
    const { productId } = req.params
    try {
        let product = await Product.findOne({ _id: productId })
        if(!product)
            return res.status(404).json({
                error: true,
                message: "404 Error"
            })
        
        res.json({
            success: true,
            product: product
        })
    }catch(err) {
        res.status(400).json({
            error:true,
            message: err
        })
    }
}