const express = require('express')
const { createMenstrual, getMenstrual, nextPeriod, periodStart, periodEnd } = require('../controllers/menstrual')


const router = express.Router()

//POST REQUESTs
router.post('/create', createMenstrual)

//GET REQUESTs
router.get('/current', getMenstrual)
router.get('/next', nextPeriod)
//DELETE REQUESTs

//PUT REQUESTs
router.put('/start', periodStart)
router.put('/end', periodEnd)


module.exports = router