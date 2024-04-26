require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const firebaseAdmin = require('firebase-admin')
const { expressjwt } = require('express-jwt')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

//CONTROLLER 1 File Import
const { checkAuthorization } = require('./controllers/user')

//ROUTES IMPORTS
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const menstrualRoutes = require('./routes/menstrual')
const uploadRoutes = require('./routes/upload')
const blogRoutes = require('./routes/blog')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/order')
const addressRoutes = require('./routes/address')





//APPLICATION CONFIFGURATION
const PORT = process.env.PORT || 8000 //PORT 
const DATABASE = (
    process.env.APP_MOD === "dev" ? process.env.DATABASE_DEV : process.env.DATABASE_PROD // DATABASE
)
const FIREBASE = path.join(
    __dirname,  
    'firebase.json'
) //FIREBASE INFO

const PUBLICKEY = fs
    .readFileSync(
        path.join(
            __dirname, 
            'keys', 
            'public.key'
        ),
        'utf-8'
    ) //PUBLIC KEY

//INIT APP
const app = express()

//FIREBASE INIT
firebaseAdmin
    .initializeApp({
        credential: firebaseAdmin.credential.cert(FIREBASE)
    })

//DATABASE INIT
mongoose
    .connect(DATABASE, {
    
    })
    .then(db => console.log(`DATBASE CONNECTED`))
    .catch(err => console.log(`Error Occured: ${JSON.stringify(err)}`))

app.use(cors({
    origin: ["http://localhost:3000"], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true,
}))
//JSON PARSER
app.use(express.json())
app.use(express.static("public"))
app.use('/app/*', express.static(
    path.join(
        __dirname, 
        'public', 
        'app'
    )
))//AUTH ROUTES ( SIGNIN, SIGNUP )
app.use(`/auth`, authRoutes)

//Middleware For JWT
app.use(
    expressjwt({
        secret: PUBLICKEY,
        userProperty: "auth",
        algorithms: ['RS256']
    })
)

//Middleware Custom Response
app.use(async (err, req, res, next ) => {
    if (err.name === "UnauthorizedError") 
        return res.status(401).json({
            error: true,
            message: `${err.inner.name}: ${err.inner.message}`
        })
    else 
        next(err)
})

//Middleware For Authorization Checking ( VAID USER OR NOT )
app.use(async (req, res, next) => {
    let user = await checkAuthorization(req)
    if(user)
        next()
    else
        return res.status(401).json({
            error: true,
            message: "Unauthorized!"
        })
})

//Authenticated Routes ( ALL FROM HERE )
app.use(`/user`, userRoutes)
app.use('/upload', uploadRoutes)
app.use('/menstrual', menstrualRoutes)
app.use('/blog', blogRoutes)
app.use('/product', productRoutes)
app.use('/cart', cartRoutes)
app.use('/order', orderRoutes)
app.use('/address', addressRoutes)

//APP ASSIGN PORT
app
    .listen(PORT, () => {
        console.log(`Server Running At PORT: ${PORT}`)
    })