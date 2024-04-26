const express = require('express')
const { getPosts, getPost } = require('../controllers/blog')

const router = express.Router()

//POST REQUESTs
// router.post('/post')

//GET REQUESTs
router.get('/posts', getPosts)
router.get('/post/:slug', getPost)

//DELETE REQUESTs
// router.delete('/post')

//PUT REQUESTs
// router.put('/post')

module.exports = router