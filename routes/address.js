const express = require('express')
const { 
    newAddress, 
    updateAddress, 
    getAddress, 
    getAllAddress, 
    deleteAddress 
} = require('../controllers/address')


const router = express.Router()


router.post('/add', newAddress)

router.put('/update', updateAddress)

router.get('/get/:addressId', getAddress)
router.get('/all', getAllAddress)

router.delete('/delete', deleteAddress)


module.exports = router