const path = require('path')
const fs = require('fs')
const { expressjwt } = require('express-jwt')

const { checkAuthorization } = require('../controllers/user')


const PUBLICKEY = fs
    .readFileSync(
        path.join(
            __dirname, 
            '..',
            'keys', 
            'public.key'
        ),
        'utf-8'
    ) //PUBLIC KEY

exports.checkJwt = expressjwt({
    secret: PUBLICKEY,
    userProperty: "auth",
    algorithms: ['RS256']
})

exports.customError = async (err, req, res, next) => {
    if (err.name === "UnauthorizedError") 
        return res.status(401).json({
            error: true,
            message: `${err.inner.name}: ${err.inner.message}`
        })
    else 
        next(err)

}

exports.checkAuth = async (req, res, next) => {
    let user = await checkAuthorization(req)
    if(user)
        next()
    else
        return res.status(401).json({
            error: true,
            message: "Unauthorized!"
        })
}
