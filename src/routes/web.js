const express = require('express')
const projectRouter = require('./projectRoute')
const categoryRouter = require('./categoryRoute')
const galleryRouter = require('./galleryRoute')
const router = express.Router()

router.use('/project',projectRouter)
router.use('/category',categoryRouter)
router.use('/gallery',galleryRouter)

module.exports = router